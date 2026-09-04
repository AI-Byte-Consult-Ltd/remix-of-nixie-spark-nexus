import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, AlertTriangle, Shield, Mail, ExternalLink, Home } from "lucide-react";

const Terms = () => {
  const seoProps = {
    title: "Terms of Service & Disclaimers — AI Byte Consult",
    description: "Read the terms of service, legal disclaimers, and important notices for AI Byte Consult Ltd. Including no financial advice, affiliate disclosure, and third-party risk notices.",
    canonical: "https://aibyteconsult.com/terms",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Terms of Service & Disclaimers",
      "url": "https://aibyteconsult.com/terms",
      "mainEntity": {
        "@type": "Organization",
        "name": "AI Byte Consult Ltd",
        "foundingDate": "2011",
      }
    },
  };

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      content: [
        "By accessing, browsing, or using any website, application, bot, widget, Mini App, or service operated by AI Byte Consult Ltd. (\"we\", \"us\", \"our\", the \"Company\"), including but not limited to aibyteconsult.com, estate.aibyteconsult.com, the NICS AI Trader Telegram bot and Mini App, and any related subdomain or channel (together, the \"Services\"), you (\"you\", \"User\") confirm that you have read, understood, and agree to be bound by these Terms of Service, our disclaimers, and all applicable laws and regulations.",
        "If you do not agree with any part of these terms, you must discontinue use of the Services immediately. These terms apply to all visitors, registered users, subscribers, clients, and others who access or use any of our Services, regardless of the specific product line (AI and automation services, NICS Real Estate, or NICS AI Trader) involved.",
        "These Terms incorporate by reference any product-specific notices, in-app disclaimers, or subscription terms presented to you at the point of signup or payment. In the event of a direct conflict, the more specific, product-level notice governs for that product only.",
      ],
    },
    {
      id: "eligibility",
      title: "Eligibility",
      icon: Shield,
      content: [
        "You must be at least 18 years old, or the age of legal majority in your jurisdiction if higher, to use any Service that involves financial trading, real estate transactions, or payment. By using such Services you represent that you meet this requirement.",
        "You are solely responsible for determining whether your use of the Services — including trading signals, real estate tools, or AI-generated content — is lawful in your country or region of residence. Some Services (in particular trading-related tools and specific broker integrations) may not be available or may be restricted in certain jurisdictions. Accessing a Service from a jurisdiction where it is prohibited does not make it permitted, and you do so entirely at your own risk and responsibility.",
        "We may refuse, suspend, or terminate access to any Service, at our discretion and without prior notice, for any user we reasonably believe is using it in violation of these Terms or applicable law.",
      ],
    },
    {
      id: "financial",
      title: "Not Financial, Investment, Real Estate or Legal Advice",
      icon: AlertTriangle,
      highlight: true,
      content: [
        "Nothing on this website, in the NICS AI Trader bot or Mini App, in our newsletters, reports, real estate tools, AI-generated insights, or any other communication from AI Byte Consult Ltd. constitutes financial, investment, tax, real estate, or legal advice, and none of it should be treated as a personal recommendation suitable for your individual circumstances.",
        "Information related to trading, investing, markets, cryptocurrencies, forex, commodities, or any financial instrument, and information related to property values, real estate investment potential, or real estate transactions, is provided for general, educational and informational purposes only. Past performance — including any historical track record, win rate, or R-multiple statistics we publish — is not indicative of, and does not guarantee, future results.",
        "You are solely responsible for your own financial, investment, and property decisions. We strongly recommend consulting a licensed financial advisor, a licensed real estate professional, and, where relevant, independent legal counsel in your jurisdiction before making any investment, trading, or property decision.",
        "AI Byte Consult Ltd. is not a registered investment advisor, broker-dealer, real estate broker, notary, or law firm in any jurisdiction unless explicitly stated otherwise for a specific, separately licensed service. Do not treat any Service as a substitute for a licensed professional.",
      ],
    },
    {
      id: "trading",
      title: "Trading, Signals & Investment Risk (NICS AI Trader)",
      icon: AlertTriangle,
      highlight: true,
      content: [
        "Trading forex, cryptocurrencies, commodities, stocks, indices, CFDs, derivatives, and other financial instruments carries a high level of risk and is not suitable for all investors. You can lose some or all of your invested or deposited capital, and losses can exceed your initial deposit where leverage is used.",
        "NICS AI Trader's signals, trading scenarios, market analysis, technical scores, confidence indicators, published win-rate/expectancy statistics, copy-trading features (where offered), and any other output are generated by automated, experimental, and AI-assisted technology. They do not guarantee profits, do not prevent losses, are not a promise of any specific outcome, and do not replace your own judgment or that of a licensed professional.",
        "Every signal, scenario, or piece of analysis reflects a snapshot of market conditions at the time it was generated. Markets move continuously; by the time you view, accept, or act on a signal, conditions may already have changed, and the scenario may no longer be favorable or achievable at the stated levels.",
        "Accepting, declining, or acting on any signal, and choosing your own position size, risk percentage, leverage, and account settings, is entirely your decision and your responsibility. We do not place trades on your behalf, hold client funds, or have discretionary control over your brokerage account, except where you explicitly connect an execution bridge you control and configure yourself.",
        "Any performance statistics we publish (including on the public track-record page and in Telegram or Threads posts) are calculated from our own signal-lifecycle records of real, closed signals. They reflect the performance of the signal itself, not of any individual user's actual trading account, which will differ due to entry timing, slippage, spread, broker execution, position sizing, and personal risk decisions.",
        "Before using any trading-related Service, ensure you fully understand the risks involved, including leverage, volatility, liquidity, counterparty, and regulatory risk in your jurisdiction, and that you can afford to lose the capital you place at risk.",
      ],
    },
    {
      id: "realestate",
      title: "Real Estate Services & Property Risk (NICS Real Estate)",
      icon: Home,
      content: [
        "NICS Real Estate (including tools, AI agents, and content presented at estate.aibyteconsult.com and referenced from this website) provides AI-assisted property information, valuation estimates, market analytics, digital workflow tools, and related services. These outputs are estimates and informational aids only — they are not appraisals, valuations, surveys, or legal opinions performed or certified by a licensed appraiser, surveyor, or real estate professional unless explicitly stated for a specific transaction.",
        "Property values, rental yields, investment projections, and market trend estimates can be materially wrong, can change without notice, and depend on local factors we may not have complete or current data for. Do not rely on any AI-generated valuation or projection as the sole basis for a purchase, sale, financing, or investment decision.",
        "Any AI chat widget or agent used in connection with real estate inquiries provides general information and lead-qualification assistance only. It does not create a client, agency, brokerage, or fiduciary relationship with you, and its responses are not binding offers, contracts, or legally enforceable representations by AI Byte Consult Ltd. or any property owner.",
        "Cross-border and international property transactions carry additional legal, tax, currency, and regulatory risk. Where a transaction references blockchain-secured records or smart contracts, this refers to a record-keeping or workflow layer only, and does not replace the legally required registration, notarization, due diligence, or title-transfer process of the jurisdiction where the property is located.",
        "You must independently verify property title, legal status, zoning, encumbrances, and all material facts through a licensed local real estate agent, lawyer, and notary before entering into any binding property transaction. We are not a party to, and accept no liability for, transactions between you and property owners, developers, agents, or other third parties introduced through our Services.",
      ],
    },
    {
      id: "ai",
      title: "AI-Generated Content & Limitations",
      content: [
        "Our Services use artificial intelligence and machine learning — including large language models, automated technical-analysis engines, and AI chat agents — to generate content, signals, insights, recommendations, translations, and responses. AI outputs may contain inaccuracies, outdated information, hallucinated facts, errors, or incomplete analysis, regardless of how confident or precise the output appears.",
        "Confidence scores, probability indicators, or similar figures shown alongside AI outputs (including trading confidence scores) are internal, experimental model outputs. They are not a statement of statistical certainty, are not independently audited or regulated, and should not be interpreted as a guarantee of accuracy or a formal risk rating.",
        "You should not rely solely on AI-generated content for critical decisions, especially in financial, real estate, legal, medical, tax, or other regulated matters. Always verify information independently and consult qualified, licensed professionals when necessary. We are not liable for decisions made in reliance on AI-generated output.",
      ],
    },
    {
      id: "affiliate",
      title: "Affiliate, Referral & Third-Party Disclosure",
      content: [
        "AI Byte Consult Ltd. participates in affiliate and referral programs. Some links on our Services, including links to third-party trading platforms, brokers (such as Vantage), real estate partners, payment processors, or other service providers, may be affiliate or sponsored links. We may receive compensation when you click, sign up, or make a purchase or deposit through these links. This compensation does not increase any cost to you and does not influence the honesty of the trading statistics or content we publish.",
        "Our referral program (where offered) pays commission to referring users based on confirmed subscription payments. Referral commission is a marketing arrangement between us and the referrer only; it does not create any advisory, agency, or fiduciary relationship between the referrer and the referred user, and the referrer is not authorized to make representations on our behalf.",
        "Our relationship with third-party providers, including Vantage and other broker, payment, hosting, or data partners, does not imply endorsement, guarantee, or responsibility for their products, services, platforms, solvency, or business practices. Any account you open, funds you deposit, or agreement you enter into with a third-party broker or provider is strictly between you and that provider, governed by that provider's own terms — not ours.",
        "Any transactions, agreements, or disputes you have with third-party providers, including brokers, real estate counterparties, or payment processors, are strictly between you and that provider. We are not a party to those agreements and are not responsible for their actions, omissions, security incidents, or insolvency.",
      ],
    },
    {
      id: "payments",
      title: "Subscriptions, Payments & Refunds",
      content: [
        "Paid subscriptions (including NICS AI Trader plans) grant access to the described Service for the stated period only. Access does not constitute, and must not be understood as, an investment, a deposit, or a share of any trading profit — it is payment for access to software tools and information.",
        "Unless required by mandatory consumer-protection law in your jurisdiction, payments are non-refundable once access has been granted or activated, including in cases where you disagree with the trading outcome of signals received during your subscription period. Suspected billing errors or unauthorized charges should be reported to us promptly at the contact details below.",
        "We reserve the right to change subscription pricing, plan structure, or included features for future billing periods, with reasonable notice where practicable.",
      ],
    },
    {
      id: "cabinet",
      title: "Personal Cabinet",
      content: [
        "The personal cabinet at aibyteconsult.com/cabinet is a browser-accessible extension of your existing NICS AI Trader Telegram account, not a separate account or product. You sign in with the Telegram Login Widget using the same Telegram account you use with the bot; a cabinet session cannot exist independently of that Telegram account.",
        "Academy certificates issued through the cabinet are named documents, issued only once you have actually completed every lesson of the NICS AI Trader Academy as recorded in our systems — never on request, and never for a fee. Each certificate is published at a public, individually verifiable link, so its authenticity can always be independently checked; do not share that link if you do not want the certificate publicly viewable.",
        "The cabinet may also surface a cashback balance from our existing 30% referral-commission program (described in \"Affiliate, Referral & Third-Party Disclosure\" above) — this is a display of the same program, not a separate offer or a promise of any additional payment.",
      ],
    },
    {
      id: "data",
      title: "Data, Privacy & Communications",
      content: [
        "We process the personal data you provide through our contact form, newsletter signup, Telegram bot, and Mini App (such as your name, email address, and Telegram account identifiers) to operate the Services, respond to inquiries, deliver signals or content you have opted into, and, where you have separately agreed, send periodic updates or marketing communications.",
        "We do not sell your personal data to third parties. We may share data with service providers strictly necessary to operate the Services (for example, our hosting, database, email-delivery, and messaging infrastructure providers), under confidentiality obligations consistent with applicable data-protection law, including the EU General Data Protection Regulation (GDPR) where it applies to you.",
        "You may withdraw consent to marketing communications at any time (for example, by unsubscribing from the newsletter or blocking/leaving the Telegram bot), and may request access to, correction of, or deletion of your personal data by contacting us at the email address below. Full technical and legal detail on data collection, use, and your rights is published in our Privacy Policy.",
      ],
    },
    {
      id: "warranty",
      title: "No Warranty",
      content: [
        "All Services, content, software, AI outputs, and tools are provided on an \"as is\" and \"as available\" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, accuracy, timeliness, completeness, or non-infringement.",
        "We do not guarantee that the Services will be uninterrupted, timely, secure, error-free, or free from viruses or other harmful components, or that any signal, valuation, or piece of content will be delivered without delay. Market-data outages, broker downtime, messaging-platform outages, or third-party API failures are outside our control and may affect delivery.",
      ],
    },
    {
      id: "ip",
      title: "Intellectual Property",
      content: [
        "All content on our Services, including but not limited to text, graphics, logos, images, videos, software, source code, product names, trading methodology, and brand materials, is the intellectual property of AI Byte Consult Ltd. or its licensors and is protected by copyright, trademark, and other applicable laws.",
        "You may not reproduce, distribute, modify, create derivative works from, publicly display, resell, or commercially exploit any content without our prior written permission, except for personal, non-commercial use, or as expressly permitted by these Terms.",
        "\"NICS AI\", \"NICS AI Trader\", \"NICS Real Estate\", \"AI Byte Consult\", and related logos, product names, and service marks are trademarks of AI Byte Consult Ltd.",
      ],
    },
    {
      id: "indemnity",
      title: "Assumption of Risk & Indemnification",
      content: [
        "You acknowledge that trading financial instruments and engaging in real estate transactions involve inherent risk of financial loss, and you knowingly and voluntarily assume all such risk when you choose to use our Services for these purposes.",
        "You agree to indemnify and hold harmless AI Byte Consult Ltd., its directors, employees, affiliates, partners, and agents from and against any claims, losses, liabilities, damages, costs, or expenses (including reasonable legal fees) arising out of or related to: (a) your use or misuse of the Services; (b) your trading, investment, or property decisions; (c) your violation of these Terms or applicable law; or (d) your interactions or agreements with third-party brokers, real estate counterparties, or other providers referenced through our Services.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      content: [
        "To the fullest extent permitted by law, AI Byte Consult Ltd., its directors, employees, affiliates, partners, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, lost trading opportunity, loss of property value, data loss, or business interruption, arising out of or related to your use of the Services, even if we have been advised of the possibility of such damages.",
        "Nothing in these Terms excludes or limits liability that cannot be excluded or limited under applicable mandatory law (for example, liability for death, personal injury, or fraud caused by our gross negligence or willful misconduct, where such exclusion is not permitted).",
        "Subject to the paragraph above, our total aggregate liability for any and all claims arising under or related to these Terms and the Services shall not exceed the amount you paid to us, if any, for the specific Service giving rise to the claim during the twelve (12) months preceding the event giving rise to the claim.",
      ],
    },
    {
      id: "severability",
      title: "Severability & Entire Agreement",
      content: [
        "If any provision of these Terms is found by a court or other competent authority to be invalid, illegal, or unenforceable, that provision will be deemed modified to the minimum extent necessary to make it valid and enforceable, or, if that is not possible, severed from these Terms, and the remaining provisions will continue in full force and effect.",
        "These Terms, together with any product-specific notices referenced in the \"Acceptance of Terms\" section, constitute the entire agreement between you and AI Byte Consult Ltd. regarding the Services and supersede any prior agreements or understandings, written or oral, regarding the same subject matter.",
      ],
    },
    {
      id: "changes",
      title: "Changes to These Terms",
      content: [
        "We reserve the right to modify, update, or replace these Terms of Service at any time. Changes will be effective immediately upon posting to this page with an updated effective date.",
        "Your continued use of the Services after any changes constitutes acceptance of the revised terms. We encourage you to review this page periodically.",
      ],
    },
    {
      id: "governing",
      title: "Governing Law & Disputes",
      content: [
        "These Terms of Service and any disputes arising from or relating to them shall be governed by and construed in accordance with the laws of Bulgaria, the jurisdiction in which AI Byte Consult Ltd. is registered, without regard to conflict-of-law principles.",
        "Any legal action or proceeding arising under these Terms shall be brought exclusively in the competent courts of Bulgaria, except where mandatory consumer-protection law in your country of residence grants you the right to bring proceedings in your local courts, in which case that mandatory right is not affected by this clause.",
        "We encourage you to contact us first at the details below to attempt to resolve any dispute informally before pursuing formal proceedings.",
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      content: [
        "If you have any questions, concerns, or requests regarding these Terms of Service, our legal notices, or your personal data, please contact us:",
      ],
      contact: true,
    },
  ];

  return (
    <>
      <SEO {...seoProps} />
      <main className="min-h-screen bg-background">
        <Header />

        {/* Hero */}
        <section className="pt-32 pb-16 relative overflow-hidden">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-primary/3 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20">
                <Scale className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Legal Notices</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
                Terms of Service <span className="text-gradient-gold">& Disclaimers</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Important legal notices, risk disclosures, and usage terms for the AI Byte Consult Ltd. website and services.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
                <span className="px-4 py-2 rounded-full bg-muted/50 border border-border/50">
                  Effective since: <strong className="text-foreground">2011</strong>
                </span>
                <span className="px-4 py-2 rounded-full bg-muted/50 border border-border/50">
                  Company: <strong className="text-foreground">AI Byte Consult Ltd.</strong>
                </span>
                <span className="px-4 py-2 rounded-full bg-muted/50 border border-border/50">
                  Reg. No.: <strong className="text-foreground">201718190</strong>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Notice banner */}
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-amber-50/50 border-amber-200/60 dark:bg-amber-950/20 dark:border-amber-800/40">
                <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-start">
                  <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800 dark:text-amber-300 mb-1">
                      This is app-owned legal content, not independent legal advice.
                    </p>
                    <p className="text-sm text-amber-700/80 dark:text-amber-400/80 leading-relaxed">
                      This page is maintained by AI Byte Consult Ltd. to communicate standard terms and risk disclosures to visitors. It should be reviewed by a qualified legal professional before being relied upon as binding legal documentation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Terms content */}
        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto space-y-8">
              {sections.map((section) => (
                <Card
                  key={section.id}
                  className={`bg-card border-border/50 card-hover overflow-hidden ${
                    section.highlight ? "ring-1 ring-primary/20" : ""
                  }`}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-4">
                      {section.icon && (
                        <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center flex-shrink-0">
                          <section.icon className="w-5 h-5 text-white" />
                        </div>
                      )}
                      {!section.icon && (
                        <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-primary" />
                        </div>
                      )}
                      <h2 className="text-2xl font-semibold text-foreground pt-1.5">
                        {section.title}
                      </h2>
                    </div>

                    <div className="space-y-4 text-muted-foreground leading-relaxed">
                      {section.content.map((paragraph, idx) => (
                        <p key={idx}>{paragraph}</p>
                      ))}
                    </div>

                    {section.contact && (
                      <div className="mt-6 grid sm:grid-cols-2 gap-4">
                        <a
                          href="mailto:info@aibyteconsult.com"
                          className="inline-flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <Mail className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Email</p>
                            <p className="text-sm text-muted-foreground">info@aibyteconsult.com</p>
                          </div>
                        </a>
                        <a
                          href="tel:+359988899109"
                          className="inline-flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border/50 hover:border-primary/30 transition-colors"
                        >
                          <ExternalLink className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium text-foreground">Phone</p>
                            <p className="text-sm text-muted-foreground">+359 988 899 109</p>
                          </div>
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              <p className="text-sm text-muted-foreground text-center pt-8">
                © 2011–{new Date().getFullYear()} AI Byte Consult Ltd. All rights reserved.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Terms;
