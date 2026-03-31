import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, MessageCircle } from "lucide-react";

const Contact = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t("contact.success"));
    setFormData({ name: "", email: "", message: "" });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl md:text-5xl font-semibold text-foreground">
              {t("contact.title").split(" ").slice(0, -1).join(" ")} <span className="text-gradient-gold">{t("contact.title").split(" ").pop()}</span>
            </h2>
            <p className="text-lg text-muted-foreground">{t("contact.subtitle")}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <a href="tel:+359988899109" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Phone className="w-5 h-5" />
              <span>+359 988 899 109</span>
            </a>
            <a href="viber://chat?number=%2B359988899109" className="flex items-center gap-2 text-muted-foreground hover:text-purple-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>Viber</span>
            </a>
            <a href="https://wa.me/359988899109" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted-foreground hover:text-green-500 transition-colors">
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp</span>
            </a>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-3xl border border-border/50 shadow-card">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">{t("contact.name")}</label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder={t("contact.name.placeholder")} className="bg-background border-border focus:border-primary rounded-xl" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">{t("contact.email")}</label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required placeholder={t("contact.email.placeholder")} className="bg-background border-border focus:border-primary rounded-xl" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">{t("contact.message")}</label>
              <Textarea id="message" name="message" value={formData.message} onChange={handleChange} required placeholder={t("contact.message.placeholder")} rows={6} className="bg-background border-border focus:border-primary resize-none rounded-xl" />
            </div>
            <Button type="submit" size="lg" className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium rounded-full">
              {t("contact.submit")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
