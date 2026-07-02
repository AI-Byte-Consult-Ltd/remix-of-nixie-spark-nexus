import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

/**
 * Home page market ticker — TradingView ticker tape with stocks, FX, crypto & gold.
 * The whole strip is a link to /trading.
 */
const HomeMarketTicker = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    container.current.innerHTML = "";

    const widget = document.createElement("div");
    widget.className = "tradingview-widget-container__widget";
    container.current.appendChild(widget);

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "NASDAQ:AAPL", title: "Apple" },
        { proName: "NASDAQ:MSFT", title: "Microsoft" },
        { proName: "NASDAQ:NVDA", title: "NVIDIA" },
        { proName: "NASDAQ:GOOGL", title: "Alphabet" },
        { proName: "NASDAQ:AMZN", title: "Amazon" },
        { proName: "NASDAQ:META", title: "Meta" },
        { proName: "NASDAQ:TSLA", title: "Tesla" },
        { proName: "OANDA:XAUUSD", title: "Gold" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        { proName: "FX:EURUSD", title: "EUR/USD" },
        { proName: "FX:GBPUSD", title: "GBP/USD" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "light",
      locale: "en",
    });
    container.current.appendChild(script);
  }, []);

  return (
    <Link
      to="/trading"
      aria-label="Open NICS AI Trading"
      className="relative block group"
    >
      <div
        className="tradingview-widget-container border-y border-border/50 bg-card/40 backdrop-blur pointer-events-none"
        ref={container}
      />
      {/* Transparent overlay to make the whole strip clickable */}
      <span className="absolute inset-0 z-10" />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 z-20 hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-foreground/80 text-background text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
        NICS AI Trading →
      </span>
    </Link>
  );
};

export default HomeMarketTicker;