import { forwardRef } from "react";
import { Link as RouterLink, type LinkProps } from "react-router-dom";
import { withTrailingSlash } from "@/lib/canonicalPath";

// react-router Link that always points at the canonical, trailing-slash URL
// (see src/lib/canonicalPath.ts). Route matching ignores the slash.
const Link = forwardRef<HTMLAnchorElement, LinkProps>(({ to, ...rest }, ref) => (
  <RouterLink ref={ref} to={typeof to === "string" ? withTrailingSlash(to) : to} {...rest} />
));
Link.displayName = "SiteLink";

export default Link;
