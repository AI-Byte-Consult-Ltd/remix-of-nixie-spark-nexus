import { useEffect, useRef } from "react";

/**
 * TradingView Ticker Tape — official free embed.
 * Docs: https://www.tradingview.com/widget/ticker-tape/
 */
const TradingViewTicker = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!container.current) return;
    // Prevent double-injection on hot reload / re-mount
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
        { proName: "OANDA:XAUUSD", title: "Gold (XAUUSD)" },
        { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
        { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
        { proName: "FX:EURUSD", title: "EUR/USD" },
        { proName: "FX:GBPUSD", title: "GBP/USD" },
        { proName: "FX:USDJPY", title: "USD/JPY" },
        { proName: "OANDA:XAGUSD", title: "Silver" },
        { proName: "TVC:DXY", title: "USD Index" },
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
    <div
      className="tradingview-widget-container border-y border-border/50 bg-card/40 backdrop-blur"
      ref={container}
    />
  );
};

export default TradingViewTicker;