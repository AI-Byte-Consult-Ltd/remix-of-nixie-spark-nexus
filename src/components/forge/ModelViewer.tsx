import { useEffect } from "react";

interface Props {
  src: string;
  alt: string;
}

/** 360° viewer. The web component is loaded lazily (it bundles three.js). */
const ModelViewer = ({ src, alt }: Props) => {
  useEffect(() => {
    void import("@google/model-viewer");
  }, []);

  return (
    <model-viewer
      src={src}
      alt={alt}
      camera-controls=""
      auto-rotate=""
      shadow-intensity="0.8"
      interaction-prompt="none"
      environment-image="neutral"
      exposure="0.9"
      style={{ width: "100%", height: "100%", background: "transparent" }}
    />
  );
};

export default ModelViewer;
