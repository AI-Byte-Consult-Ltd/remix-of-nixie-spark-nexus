import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initSiteAnalytics, trackPageview } from "@/lib/siteAnalytics";

/** Counts a page view on every route change (cookie-free, see src/lib/siteAnalytics.ts). */
const SiteAnalytics = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    initSiteAnalytics();
  }, []);
  useEffect(() => {
    trackPageview();
  }, [pathname]);
  return null;
};

export default SiteAnalytics;
