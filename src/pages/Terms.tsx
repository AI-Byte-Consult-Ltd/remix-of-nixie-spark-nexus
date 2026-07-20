import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Scale, AlertTriangle, Shield, Mail, ExternalLink } from "lucide-react";

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
        "By accessing, browsing, or using any website, application, tool, or service operated by AI Byte Consult Ltd. (\"we\", \"us\", \"our\"), you confirm that you have read, understood, and agree to be bound by these Terms of Service and all applicable laws and regulations.",
        "If you do not agree with any part of these terms, you must discontinue use of our websites and services immediately. These terms apply to all visitors, users, clients, and others who access or use our platforms.",
      ],
    },
    {
      id: "financial",
      title: "Not Financial Advice",
      icon: AlertTriangle,
      highlight: true,
      content: [
        "Nothing on this website, in our newsletters, reports, trading tools, AI-generated insights, or any other communication from AI Byte Consult Ltd. constitutes financial, investment, tax, or legal advice.",
        "Information related to trading, investing, markets, cryptocurrencies, forex, or any financial product is provided for educational and informational purposes only. Past performance is not indicative of future results.",
        "You are solely responsible for your own financial decisions. We strongly recommend consulting a licensed financial advisor before making any investment or trading decision.",
      ],
    },
    {
      id: "affiliate",
      title: "Affiliate & Third-Party Disclosure",
      content: [
        "AI Byte Consult Ltd. participates in affiliate and referral programs. Some links on this website, including links to third-party trading platforms, brokers, or service providers, may be affiliate links. We may receive compensation when you click, sign up, or make a purchase through these links.",
        "Our relationship with third-party providers, including Vantage and other broker partners, does not imply endorsement, guarantee, or responsibility for their products, services, platforms, or business practices.",
        "Any transactions, agreements, or disputes you have with third-party providers are strictly between you and that provider. We are not a party to those agreements and are not responsible for their actions or omissions.",
      ],
    },
    {
      id: "trading",
      title: "Trading & Investment Risk",
      content: [
        "Trading forex, cryptocurrencies, commodities, stocks, derivatives, and other financial instruments carries a high level of risk and may not be suitable for all investors. You can lose some or all of your invested capital.",
        "AI-generated signals, market analysis, copy-trading features, and other tools provided by AI Byte Consult Ltd. are experimental technologies. They do not guarantee profits, prevent losses, or replace professional judgment.",
        "Before using any trading-related service, ensure you fully understand the risks involved, including leverage, volatility, liquidity, and regulatory risks in your jurisdiction.",
      ],
    },
    {
      id: "ai",
      title: "AI-Generated Content & Limitations",
      content: [
        "Our platforms use artificial intelligence and machine learning to generate content, insights, recommendations, and responses. AI outputs may contain inaccuracies, outdated information, errors, or incomplete analysis.",
        "You should not rely solely on AI-generated content for critical decisions, especially in financial, legal, medical, or regulated matters. Always verify information independently and consult qualified professionals when necessary.",
      ],
    },
    {
      id: "warranty",
      title: "No Warranty",
      content: [
        "All services, content, software, and tools are provided on an \"as is\" and \"as available\" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, accuracy, reliability, or non-infringement.",
        "We do not guarantee that our platforms will be uninterrupted, secure, error-free, or free from viruses or other harmful components.",
      ],
    },
    {
      id: "ip",
      title: "Intellectual Property",
      content: [
        "All content on this website, including but not limited to text, graphics, logos, images, videos, software, code, product names, and brand materials, is the intellectual property of AI Byte Consult Ltd. or its licensors and is protected by copyright, trademark, and other applicable laws.",
        "You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any content without our prior written permission, except for personal, non-commercial use.",
        "\"NICS AI\", \"AI Byte Consult\", and related logos, product names, and service marks are trademarks of AI Byte Consult Ltd.",
      ],
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      content: [
        "To the fullest extent permitted by law, AI Byte Consult Ltd., its directors, employees, affiliates, partners, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, data loss, or business interruption, arising out of or related to your use of our services.",
        "Our total liability for any claims arising under these terms shall not exceed the amount you paid to us, if any, for the specific service giving rise to the claim during the twelve (12) months preceding the event.",
      ],
    },
    {
      id: "changes",
      title: "Changes to These Terms",
      content: [
        "We reserve the right to modify, update, or replace these Terms of Service at any time. Changes will be effective immediately upon posting to this page with an updated effective date.",
        "Your continued use of our services after any changes constitutes acceptance of the revised terms. We encourage you to review this page periodically.",
      ],
    },
    {
      id: "governing",
      title: "Governing Law",
      content: [
        "These Terms of Service and any disputes arising from or relating to them shall be governed by and construed in accordance with the laws of the jurisdiction in which AI Byte Consult Ltd. is registered, without regard to conflict of law principles.",
        "Any legal action or proceeding arising under these terms shall be brought exclusively in the courts of that jurisdiction.",
      ],
    },
    {
      id: "contact",
      title: "Contact Us",
      content: [
        "If you have any questions, concerns, or requests regarding these Terms of Service or our legal notices, please contact us:",
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
