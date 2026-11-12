import { useState } from "react";
import { DnaHelix } from "@/components/dna/DnaHelix";
import { HOME_DNA } from "./homeDna";

// On a phone the spiral runs behind the text, so it is drawn softer there.
const useNarrow = () => useState(() => typeof window !== "undefined" && window.innerWidth < 768)[0];

/*
 * Rotating DNA spiral in the site banners (2026-11-11, Alexander: "на первую
 * страницу и на страницу trading в баннер спираль крутящуюся"). Decorative,
 * behind the hero text, never takes clicks. Both heroes are dark, so the
 * dust glows like in Alexander's reference.
 */
const HeroDna = ({ variant }: { variant: "home" | "trading" }) => {
  const narrow = useNarrow();
  if (variant === "home") {
    return (
      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
        <DnaHelix
          from={HOME_DNA.from}
          to={HOME_DNA.to}
          radius={0.08}
          taper={[0.55, 1.2]}
          turns={3}
          speed={0.5}
          density={4200}
          bridges={17}
          knots={[0.3, 0.57, 0.84]}
          maxDpr={1.5}
          intensity={narrow ? 0.5 : 0.95}
        />
      </div>
    );
  }
  // /trading: the hero section is dark (class `dark`), the spiral runs
  // diagonally behind the example signal card.
  return (
    <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
      <DnaHelix
        from={[0.47, 1.06]}
        to={[1.0, -0.04]}
        radius={0.13}
        taper={[0.55, 1.2]}
        turns={3}
        speed={0.5}
        density={4200}
        bridges={17}
        knots={[0.27, 0.55, 0.85]}
        maxDpr={1.5}
        intensity={narrow ? 0.5 : 1}
      />
    </div>
  );
};

export default HeroDna;
