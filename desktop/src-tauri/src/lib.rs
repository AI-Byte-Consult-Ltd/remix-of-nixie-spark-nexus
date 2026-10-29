//! NICS AI Trader for Windows: a thin native shell around the web cabinet
//! at aibyteconsult.com. The app itself is the live site, so every site
//! release reaches desktop users without reinstalling.

use tauri::webview::NewWindowResponse;
use tauri::{Manager, Url, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_opener::OpenerExt;

const MAIN_WINDOW: &str = "main";

/// Hosts that stay inside the app window. Everything else (Telegram chats,
/// payment pages, social links) opens in the user's default browser.
fn is_in_app(url: &Url) -> bool {
    match url.scheme() {
        "tauri" | "about" | "data" | "blob" => return true,
        "http" | "https" => {}
        _ => return false,
    }
    matches!(
        url.host_str(),
        Some("aibyteconsult.com")
            | Some("www.aibyteconsult.com")
            | Some("tauri.localhost")
            | Some("localhost")
            | Some("oauth.telegram.org")
            | Some("telegram.org")
    )
}

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            if let Some(window) = app.get_webview_window(MAIN_WINDOW) {
                let _ = window.unminimize();
                let _ = window.show();
                let _ = window.set_focus();
            }
        }))
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            let nav_handle = app.handle().clone();
            let popup_handle = app.handle().clone();

            // index.html is a small local page: it moves to the live cabinet
            // when online and shows an honest "no connection" screen otherwise.
            WebviewWindowBuilder::new(app, MAIN_WINDOW, WebviewUrl::App("index.html".into()))
                .title("NICS AI Trader")
                .inner_size(1200.0, 820.0)
                .min_inner_size(380.0, 600.0)
                .center()
                .on_navigation(move |url| {
                    if is_in_app(url) {
                        return true;
                    }
                    let _ = nav_handle.opener().open_url(url.as_str(), None::<&str>);
                    false
                })
                .on_new_window(move |url, _features| {
                    // The Telegram login widget needs a real popup that keeps
                    // window.opener, so it gets the default WebView2 window.
                    if url.host_str() == Some("oauth.telegram.org") {
                        return NewWindowResponse::Allow;
                    }
                    let _ = popup_handle.opener().open_url(url.as_str(), None::<&str>);
                    NewWindowResponse::Deny
                })
                .build()?;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running NICS AI Trader");
}
