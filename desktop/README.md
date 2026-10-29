# NICS AI Trader for Windows

A thin Tauri 2 shell around the web cabinet (`https://aibyteconsult.com/cabinet`).
The window shows the live site, so site releases reach desktop users without a
new installer. Links to other sites (Telegram chats, payments) open in the
default browser; the Telegram login popup stays in the app.

- Installer: built by `.github/workflows/desktop-windows.yml` on `windows-latest`
  and published as the latest GitHub Release
  (`releases/latest/download/NICS-AI-Trader-Setup.exe`).
- New installer version: bump `version` in `src-tauri/tauri.conf.json`
  (and `Cargo.toml`), merge to `main`.
- Not code-signed yet: SmartScreen shows "Windows protected your PC" until a
  company code-signing certificate is added to the workflow.
