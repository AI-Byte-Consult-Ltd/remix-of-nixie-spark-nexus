import type { VideoGuide } from "./types";

const en: VideoGuide = {
  guideHeading: "How to use",
  guideIntro: "From sign-in to your first video in about five minutes. NICS Video and NICS Studio share one sign-in and one credit balance.",
  guides: [
    {
      title: "Sign in and get 10 free credits",
      steps: [
        "Tap “Sign in”, enter your email and tap “Get code”.",
        "Open the email from noreply@aibyteconsult.com (check spam too) and enter the 6-digit code. It is valid for 15 minutes.",
        "You stay signed in on this device, on NICS Video and in NICS Studio.",
        "Tap “Get 10 free credits” in Pricing, enter your name and confirm. No card needed; the credits are given once per email and last 30 days.",
      ],
    },
    {
      title: "Automatic editing with NICS Video",
      steps: [
        "In “Upload your footage”, write a title for the covers (the English one is optional).",
        "Choose up to 20 clips: MP4, MOV, AVI, MKV, M4V or 3GP, up to 1 GB each and 1.5 GB in total.",
        "Tap “Upload and start” and keep the page open until the upload finishes. One package costs 10 credits.",
        "After that you can close the page. The status shows the queue, scene analysis, edit plan, rendering and covers.",
        "When the package is ready you get an email with a link. Download the Short, the long video and the four covers within 7 days.",
      ],
    },
    {
      title: "Edit it yourself in NICS Studio",
      steps: [
        "Open NICS Studio and add videos or photos under Media. The final video can be up to 3 minutes.",
        "Edit on the timeline: trim, split, reorder, add text, music, filters, zooms and fades. Manual edits are free.",
        "Or write to the agent, for example: “cut the pauses, add captions 3 words at a time, a little bigger, and add zooms”. One request costs 1 credit.",
        "Captions: open Captions, choose Russian or English and tap “Generate captions” (1 credit). Check and fix the text.",
        "Choose 9:16, 16:9 or 1:1 and tap “Export” (2 credits), then “Download”. Projects save automatically in this browser.",
      ],
    },
    {
      title: "Buy a plan",
      steps: [
        "When credits run out, the site tells you how many are needed and how many are left.",
        "In Pricing choose Start, Creator or Pro and tap “Continue to payment”. Use the same email you sign in with.",
        "Pay by card on the secure Revolut page that opens in a new tab. The charge is in euros.",
        "A few minutes after payment the credits turn on by themselves for 30 days. Carry on with uploads or NICS Studio.",
      ],
    },
  ],
  faqHeading: "Frequently asked",
  faq: [
    {
      q: "How does NICS Video work?",
      a: "Upload your clips and the system picks the best shots and edits a Short, a long video and covers for you. To edit by hand, open NICS Studio, tell the agent what to change, refine the timeline and export when you are ready.",
    },
    {
      q: "What videos can I use?",
      a: "For automatic editing: MP4, MOV, AVI, MKV, M4V or 3GP, up to 20 files, 1 GB each and 1.5 GB in total. NICS Studio takes MP4 or MOV videos and JPG or PNG photos, for a final video of up to 3 minutes.",
    },
    {
      q: "Can I edit my videos?",
      a: "Yes, in NICS Studio: trim and reorder clips, add captions, text, music, filters, zooms and fades, and switch between 9:16, 16:9 and 1:1. Manual edits cost nothing; credits are only for the agent, captions and export.",
    },
    {
      q: "What languages are supported?",
      a: "Covers come in Russian and English. Captions and agent commands work in Russian and English. The site and the editor are available in 12 languages, and more languages are coming.",
    },
    {
      q: "How do credits work?",
      a: "One balance for both services: an automatic package costs 10 credits, an export in NICS Studio 2, an agent request 1, captions 1. Credits are taken only after the work succeeded and last 30 days.",
    },
    {
      q: "Can I cancel my plan?",
      a: "There is nothing to cancel: every payment is a one-off purchase of credits for 30 days, with no auto-renewal and no repeat charges. To continue, buy a plan again.",
    },
    {
      q: "How much does NICS Video cost?",
      a: "You start free with 10 credits, once. Then Start 14.99 EUR (60 credits), Creator 34.99 EUR (250) or Pro 69.99 EUR (700), each for 30 days. Payment by card through Revolut.",
    },
    {
      q: "What is a credit?",
      a: "A credit is how processing is paid for here: automatic editing, speech recognition for captions, agent requests and rendering the final video. On the Start plan one credit costs about 25 cents.",
    },
    {
      q: "Where are my files kept?",
      a: "Automatic editing runs on our own hardware, never in outside clouds; finished files are kept for 7 days. NICS Studio works on your device and does not upload your files anywhere.",
    },
    {
      q: "The sign-in code did not arrive",
      a: "Check spam and tap “Send again”. Up to 5 codes per hour can be sent to one email. Still stuck? Write to info@aibyteconsult.com.",
    },
  ],
};

export default en;
