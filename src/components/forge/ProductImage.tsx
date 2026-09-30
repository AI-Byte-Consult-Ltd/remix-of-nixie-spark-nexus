import { useState } from "react";
import { Box } from "lucide-react";
import type { CatalogItem } from "@/data/forgeCatalog";

interface Props {
  item: CatalogItem;
  alt: string;
}

/** Photo when a URL is set and loads, otherwise an honest SVG placeholder. */
const ProductImage = ({ item, alt }: Props) => {
  const [failed, setFailed] = useState(false);

  if (item.image && !failed) {
    return (
      <img
        src={item.image}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover"
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${item.tint[0]}33, ${item.tint[1]}55)` }}
    >
      <Box className="w-16 h-16" style={{ color: item.tint[0] }} strokeWidth={1.25} />
    </div>
  );
};

export default ProductImage;
