import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Thanks for subscribing to our newsletter!");
    setEmail("");
  };

  return (
    <section className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-card p-12 rounded-3xl space-y-6 border border-border/50 shadow-card">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Stay <span className="text-gradient-gold">Updated</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Join our innovation updates and be the first to know about new features and insights
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                className="flex-1 bg-background border-border focus:border-primary rounded-full px-6"
              />
              <Button 
                type="submit"
                size="lg"
                className="bg-foreground hover:bg-foreground/90 text-background font-medium rounded-full px-8"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
