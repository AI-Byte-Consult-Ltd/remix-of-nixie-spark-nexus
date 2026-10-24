// "How to use" guide and FAQ on /nics-video, one per site language.
// Keep the facts in line with the live product: credit prices in
// src/features/studio/credits.ts and [26 VIDEO], plan prices in NicsVideo.tsx,
// upload limits in NicsVideoStudio.tsx. Plans are one-off 30-day payments.
export interface VideoGuide {
  guideHeading: string;
  guideIntro: string;
  guides: { title: string; steps: string[] }[];
  faqHeading: string;
  faq: { q: string; a: string }[];
}
