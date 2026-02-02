import { MessageCircle, Bot, BrainCircuit, Sparkles, ArrowUpRight, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const SCIProducts = () => {
  const { t } = useLanguage();

  const products = [
    {
      icon: MessageCircle,
      title: "SCI Lite",
      subtitle: "Interactive Widget",
      tagline: "Your website finally starts responding to people",
      oneTimePrice: "€220",
      monthlyPrice: "€25",
      description: "Transform your static website into an interactive experience. An intelligent widget that greets visitors, answers common questions, and guides them to the right information — 24/7, without human intervention.",
      features: [
        "Smart greeting & visitor recognition",
        "FAQ automation with instant responses",
        "Lead capture with intelligent forms",
        "Multi-language support",
        "Easy embed on any website",
        "Basic analytics dashboard",
      ],
      paymentLink: "https://checkout.revolut.com/pay/bfc39f6d-b7ab-40a3-a42a-b161d5515aa1",
    },
    {
      icon: Bot,
      title: "SCI Smart",
      subtitle: "AI-Assisted Interface",
      tagline: "AI answers first — you step in only when it matters",
      oneTimePrice: "€380",
      monthlyPrice: "€35",
      description: "Intelligent conversation layer that handles routine inquiries automatically while seamlessly escalating complex matters to your team. Your clients get instant responses, you get qualified leads.",
      features: [
        "Everything in SCI Lite",
        "AI-powered conversation engine",
        "Smart escalation to human agents",
        "CRM integration (Notion, Airtable, etc.)",
        "Conversation history & context",
        "Priority email notifications",
        "Custom response training",
        "Advanced analytics & insights",
      ],
      popular: true,
      paymentLink: "https://checkout.revolut.com/pay/96646897-cc38-46b8-b127-4ff669334d68",
    },
    {
      icon: BrainCircuit,
      title: "SCI Pro",
      subtitle: "Custom AI Client Agent",
      tagline: "A respectful AI that prepares clients before they meet you",
      oneTimePrice: "€670",
      monthlyPrice: "€85",
      description: "A fully customized AI agent tailored to your business. It understands your services, qualifies prospects, schedules meetings, and ensures every client conversation starts with context — saving you hours of back-and-forth.",
      features: [
        "Everything in SCI Smart",
        "Custom AI personality & tone",
        "Deep service knowledge training",
        "Appointment scheduling integration",
        "Client qualification workflows",
        "Document & proposal generation",
        "Multi-channel deployment",
        "White-label customization",
        "Dedicated support & training",
        "API access for custom integrations",
      ],
      paymentLink: "https://checkout.revolut.com/pay/844029e5-8718-443a-82e4-d979f5a211a6",
    },
  ];

  return (
    <section id="sci-products" className="py-24 relative overflow-hidden bg-background">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Smart Client Interface</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-foreground">
            Smart Client <span className="text-gradient-gold">Interface (SCI)</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From static websites to living client conversations. Transform how your business communicates with intelligent AI-powered interfaces.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <div
              key={index}
              className="group relative animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Popular badge */}
              {product.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                  <div className="px-4 py-1 rounded-full bg-foreground text-background text-sm font-medium shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Card */}
              <div className={`relative h-full bg-card rounded-3xl p-8 border ${product.popular ? 'border-primary/50 shadow-gold' : 'border-border/50'} card-hover overflow-hidden`}>
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-gold flex items-center justify-center mb-6">
                  <product.icon className="w-7 h-7 text-white" />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-2xl font-semibold mb-1 text-foreground">{product.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{product.subtitle}</p>
                  <p className="text-sm font-medium text-primary mb-4">
                    {product.tagline}
                  </p>
                  
                  {/* Pricing */}
                  <div className="mb-6 p-4 rounded-2xl bg-muted/50 border border-border/50">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-3xl font-semibold text-gradient-gold">
                        {product.oneTimePrice}
                      </span>
                      <span className="text-muted-foreground">one-time</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-medium text-foreground">+ {product.monthlyPrice}</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-foreground/70 mb-6 leading-relaxed text-sm">
                    {product.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-8">
                    {product.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3 text-sm text-foreground/70">
                        <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <a
                    href={product.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn relative w-full flex items-center justify-center gap-2 px-6 py-4 rounded-full font-medium text-lg bg-foreground text-background hover:bg-foreground/90 transition-all duration-300"
                  >
                    Get Started
                    <ArrowUpRight className="w-5 h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-12 animate-fade-in">
          <p className="text-muted-foreground">
            All packages include setup, training, and ongoing technical support. Custom enterprise solutions available upon request.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SCIProducts;
