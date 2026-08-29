import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

const Newsletter = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email });
      if (error) {
        if (error.code === "23505") {
          toast.success(t("newsletter.success"));
          setEmail("");
        } else {
          throw error;
        }
      } else {
        toast.success(t("newsletter.success"));
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not subscribe right now. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-card p-12 rounded-3xl space-y-6 border border-border/50 shadow-card">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              {t("newsletter.title").split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{t("newsletter.title").split(" ").pop()}</span>
            </h2>
            <p className="text-lg text-muted-foreground">{t("newsletter.subtitle")}</p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("newsletter.placeholder")} required disabled={submitting} className="flex-1 bg-background border-border focus:border-primary rounded-full px-6" />
              <Button type="submit" size="lg" disabled={submitting} className="bg-foreground hover:bg-foreground/90 text-background font-medium rounded-full px-8">
                {submitting ? "..." : t("newsletter.submit")}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
