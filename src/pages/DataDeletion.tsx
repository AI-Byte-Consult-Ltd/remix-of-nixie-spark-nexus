import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const DataDeletion = () => {
  const seoProps = {
    title: "Data Deletion Instructions — AI Byte Consult",
    description: "How to request deletion of your data connected to AI Byte Consult Ltd. applications, including data received through Meta/Threads platform integrations.",
    canonical: "https://aibyteconsult.com/delete",
  };

  return (
    <>
      <SEO {...seoProps} />
      <main className="min-h-screen bg-background">
        <Header />
        <section className="pt-32 pb-24">
          <div className="container mx-auto px-4 max-w-2xl">
            <h1 className="text-3xl font-semibold text-foreground mb-8">
              Data Deletion Instructions
            </h1>

            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                AI Byte Consult Ltd. is an applied-AI company — this page covers
                data collected across all of our products, not only our Meta/Threads
                integration: the website contact form and newsletter, the NICS AI
                Trader Telegram bot and Mini App, and our connected Threads account.
                If you have used any of these and provided us with personal data,
                you can request that we delete it at any time.
              </p>

              <p>
                To request deletion, send an email to{" "}
                <a
                  href="mailto:info@aibyteconsult.com?subject=Data%20deletion%20request"
                  className="text-primary hover:underline"
                >
                  info@aibyteconsult.com
                </a>{" "}
                with the subject line "Data deletion request", from the email
                address or account you used with us. Please tell us which
                product the request relates to (Telegram bot, NICS AI Trader
                Mini App, newsletter, contact form, or our Meta/Threads
                integration), so we can locate your data.
              </p>

              <p>
                Once we receive and verify your request, we will delete the
                personal data we hold about you from our active systems —
                including Telegram account identifiers, trading-signal and
                journal history, newsletter subscription, contact-form
                submissions, and any Meta/Threads access tokens or platform
                data tied to your request — within 30 days, except where we
                are required to retain specific records by law. Data already
                contained in a routine database backup ages out on our normal
                backup rotation schedule.
              </p>

              <p>
                If your request relates to our Meta/Threads integration, note
                that this integration is used to publish our own account's
                trading updates — we do not collect data from your personal
                Meta account through it. You can still revoke our app's access
                at any time from your Meta Accounts Center under Apps and
                websites.
              </p>

              <p>
                See our{" "}
                <a href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </a>{" "}
                for full details on what data we collect and why. For any
                questions about this process, contact{" "}
                <a
                  href="mailto:info@aibyteconsult.com"
                  className="text-primary hover:underline"
                >
                  info@aibyteconsult.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    </>
  );
};

export default DataDeletion;
