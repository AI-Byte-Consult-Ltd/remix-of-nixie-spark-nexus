import { useEffect, useRef } from "react";

// Fades each section's content in as it scrolls into view. Applied to the
// sections that exist on mount (the first one, the hero, is left alone so the
// top of the page paints at once). Does nothing with reduced motion or
// without IntersectionObserver, so content is never left hidden.
export const useRevealOnScroll = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>("section > .container")).slice(1);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("reveal-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    for (const el of targets) {
      el.classList.add("reveal");
      observer.observe(el);
    }
    return () => {
      observer.disconnect();
      for (const el of targets) el.classList.remove("reveal", "reveal-in");
    };
  }, []);

  return ref;
};
