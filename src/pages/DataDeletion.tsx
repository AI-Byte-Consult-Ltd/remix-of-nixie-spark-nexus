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
                If you have connected a Meta account (including Threads) to any
                application operated by AI Byte Consult Ltd., or otherwise
                provided us with personal data, you can request that we delete
                it at any time.
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
                account or platform (e.g. Threads, Telegram) the request
                relates to, so we can locate your data.
              </p>

              <p>
                Once we receive and verify your request, we will delete the
                personal data we hold about you from our systems — including
                any access tokens, account identifiers, and platform data
                received through connected Meta permissions — within 30 days,
                except where we are required to retain specific records by
                law.
              </p>

              <p>
                You can also revoke our app's access to your Meta account
                directly at any time, from your Meta Accounts Center under
                Apps and websites — this immediately stops us from receiving
                any further data from that account.
              </p>

              <p>
                For any questions about this process, contact{" "}
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
