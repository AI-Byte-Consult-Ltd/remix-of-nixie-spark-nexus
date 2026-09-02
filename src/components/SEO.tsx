import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  imageAlt?: string;
  ogType?: "website" | "article" | "product";
  locale?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  noindex?: boolean;
}

const DEFAULT_IMAGE = "https://aibyteconsult.com/android-chrome-512x512.png";

const SEO = ({
  title,
  description,
  canonical,
  ogImage,
  imageAlt = "AI Byte Consult and the NICS AI Ecosystem",
  ogType = "website",
  locale = "en_US",
  jsonLd,
  noindex,
}: SEOProps) => {
  const canonicalUrl = noindex
    ? undefined
    : canonical ||
      (typeof window !== "undefined"
        ? window.location.origin + window.location.pathname
        : undefined);
  const resolvedImage = ogImage || DEFAULT_IMAGE;
  const jsonLdEntries = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <html lang="en" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="author" content="AI Byte Consult Ltd" />
      <meta name="application-name" content="AI Byte Consult" />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"}
      />
      <meta name="googlebot" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large"} />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      <meta property="og:site_name" content="AI Byte Consult" />
      <meta property="og:locale" content={locale} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={resolvedImage} />
      <meta property="og:image:alt" content={imageAlt} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@aibyteconsult" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={resolvedImage} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {jsonLdEntries.map((entry, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(entry)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEO;
