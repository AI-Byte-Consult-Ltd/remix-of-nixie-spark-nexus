const About = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-muted/30">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-semibold mb-6 text-foreground">
            About the <span className="text-gradient-gold">Company</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
            AI Byte Consult Ltd. is a global technology company specializing in artificial intelligence and automation. We design intelligent systems that optimize operations, enhance decision-making, and accelerate digital transformation for organizations worldwide.
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Our AI-driven solutions serve diverse industries — from B2B and B2C enterprises to hospitality, healthcare, logistics, geology, and scientific research. We build scalable platforms that help businesses automate workflows, analyze data efficiently, and unlock new opportunities through intelligent innovation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
