import type { VideoContent } from "@/pages/NicsVideo";
import type { CheckoutText } from "@/components/video/NicsVideoCheckout";
import type { UploadText } from "@/components/video/NicsVideoStudio";
import type { AccountText } from "@/features/account/AccountDialog";
import type { StudioStrings } from "@/features/studio/strings";

// Everything NICS Video and NICS Studio show, for one site language.
// English and Russian live next to their components.
export interface NicsVideoLocale {
  page: VideoContent;
  checkout: CheckoutText;
  upload: UploadText;
  account: AccountText;
  studio: StudioStrings;
}
