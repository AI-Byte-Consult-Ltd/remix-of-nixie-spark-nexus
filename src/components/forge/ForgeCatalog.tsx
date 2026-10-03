import { useState } from "react";
import { Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CATALOG, COLOR_IDS, COLOR_HEX, shippingFor, fmtEur, type ColorId, type CatalogItem } from "@/data/forgeCatalog";
import ProductImage from "./ProductImage";
import ForgeModelDialog from "./ForgeModelDialog";
import type { ForgeText } from "./forgeI18n";
import type { PendingOrder } from "./ForgeCheckout";

interface CardProps {
  item: CatalogItem;
  t: ForgeText;
  onOrder: (o: PendingOrder) => void;
}

const CatalogCard = ({ item, t, onOrder }: CardProps) => {
  const [color, setColor] = useState<ColorId>("white");
  const [text, setText] = useState("");
  const [view3d, setView3d] = useState(false);
  const [variantKey, setVariantKey] = useState(item.variants?.[0]?.key ?? "");
  const variant = item.variants?.find((v) => v.key === variantKey) ?? item.variants?.[0];
  const baseName = t.items[item.id] ?? item.id;
  const name = variant ? `${baseName} · ${t.variants[variant.key]}` : baseName;
  const image = variant?.image ?? item.image;
  const model = variant?.model ?? item.model;
  const itemId = variant?.id ?? item.id;
  const revolutUrl = variant?.revolutUrl ?? item.revolutUrl;
  const description = t.itemDesc[item.id];
  const shipping = shippingFor(item);

  return (
    <Card className="bg-card border-border/50 overflow-hidden flex flex-col">
      <div className="aspect-square bg-muted">
        <ProductImage item={{ ...item, image }} alt={name} />
      </div>
      <CardContent className="pt-5 space-y-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-foreground leading-snug">{baseName}</h3>
          <div className="text-right shrink-0">
            <div className="font-semibold text-primary">€{fmtEur(item.price)}</div>
            <div className="text-xs text-muted-foreground">+ €{shipping} {t.shipping}</div>
          </div>
        </div>

        {description && <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>}

        {item.variants && (
          <div className="space-y-1.5">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.variantTitle}</div>
            <div className="grid grid-cols-1 gap-2" role="radiogroup" aria-label={t.variantTitle}>
              {item.variants.map((v) => (
                <button
                  key={v.key}
                  type="button"
                  role="radio"
                  aria-checked={variant?.key === v.key}
                  onClick={() => setVariantKey(v.key)}
                  className={`rounded-xl border-2 px-3 py-2 text-left text-sm transition-colors ${variant?.key === v.key ? "border-primary bg-primary/5 text-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}
                >
                  {t.variants[v.key]}
                </button>
              ))}
            </div>
          </div>
        )}

        {!item.noColor && (
          <div className="space-y-1.5">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.optColor}</div>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t.optColor}>
              {COLOR_IDS.map((c) => (
                <button
                  key={c}
                  type="button"
                  role="radio"
                  aria-checked={color === c}
                  aria-label={t.colors[c]}
                  title={t.colors[c]}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform ${color === c ? "border-primary scale-110 ring-2 ring-primary/30" : "border-border"}`}
                  style={{ backgroundColor: COLOR_HEX[c] }}
                />
              ))}
            </div>
          </div>
        )}

        {item.hasText && (
          <div className="space-y-1.5">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{t.optText}</div>
            <Input value={text} maxLength={24} placeholder={t.optTextPh} onChange={(e) => setText(e.target.value)} />
          </div>
        )}

        {model && description && <p className="text-xs text-muted-foreground leading-relaxed">{t.conceptNote}</p>}

        <div className="mt-auto pt-2 space-y-2">
          {model && (
            <Button variant="outline" className="w-full rounded-full border-2" onClick={() => setView3d(true)}>
              <Box className="mr-2 w-4 h-4" />
              {t.view3d}
            </Button>
          )}
          <Button
            className="w-full rounded-full bg-foreground hover:bg-foreground/90 text-background"
            onClick={() =>
              onOrder({
                kind: "catalog",
                itemId,
                itemName: name,
                price: item.price,
                shipping,
                color: item.noColor ? "" : color,
                text: item.hasText ? text.trim() : "",
                revolutUrl,
              })
            }
          >
            {t.orderThis} · €{fmtEur(item.price + shipping)}
          </Button>
        </div>
      </CardContent>

      {model && <ForgeModelDialog open={view3d} onClose={() => setView3d(false)} title={name} src={model} t={t} />}
    </Card>
  );
};

interface Props {
  t: ForgeText;
  onOrder: (o: PendingOrder) => void;
}

const ForgeCatalog = ({ t, onOrder }: Props) => (
  <section id="catalog" className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground">{t.catalogTitle}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">{t.catalogSubtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATALOG.map((item) => (
            <CatalogCard key={item.id} item={item} t={t} onOrder={onOrder} />
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default ForgeCatalog;
