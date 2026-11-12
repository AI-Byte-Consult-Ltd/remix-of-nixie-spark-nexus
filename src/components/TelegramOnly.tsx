import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";

/*
 * /nics-app is the Telegram Mini App: it authenticates with Telegram initData
 * and shows nothing useful in a normal browser. Visitors who open it from a
 * search result or an old link land in the web cabinet instead, which runs
 * the same dashboard on an e-mail / Telegram login. Inside Telegram the
 * launch data arrives in the URL hash (tgWebAppData) and in
 * window.Telegram.WebApp.initData once telegram-web-app.js has loaded, so
 * the redirect only happens when neither shows up.
 */
const inTelegram = () =>
  /tgWebApp/i.test(window.location.hash + window.location.search) ||
  Boolean(window.Telegram?.WebApp?.initData);

const TelegramOnly = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(inTelegram);

  useEffect(() => {
    if (ready) return;
    const timer = window.setTimeout(() => {
      if (inTelegram()) {
        setReady(true);
        return;
      }
      const signalId = new URLSearchParams(window.location.search).get("signalId");
      navigate(signalId ? `/cabinet/trader/signals?signalId=${encodeURIComponent(signalId)}` : "/cabinet", {
        replace: true,
      });
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [ready, navigate]);

  if (!ready) return <main className="grid min-h-screen place-items-center bg-[#07090f] text-sm text-slate-400">NICS Trading Ecosystem…</main>;
  return <>{children}</>;
};

export default TelegramOnly;
