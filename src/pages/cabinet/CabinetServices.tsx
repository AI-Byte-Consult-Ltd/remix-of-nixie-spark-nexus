import { Card, CardContent } from "@/components/ui/card";
import { useCabinetOutletContext } from "./CabinetLayout";

const SERVICES = [
  { href: "https://estate.aibyteconsult.com", label: "NICS Real Estate", external: true },
  { href: "/nics-ecosystem", label: "NICS AI Ecosystem", external: false },
  { href: "/trading", label: "NICS AI Trading", external: false },
  { href: "/nics-multimedia", label: "NICS Multimedia", external: false },
];

const CabinetServices = () => {
  const { t } = useCabinetOutletContext();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gradient-gold">{t("servicesTitle")}</h1>
        <p className="mt-1 text-sm text-slate-400">{t("servicesLead")}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {SERVICES.map((service) => (
          <Card key={service.href} className="border-white/10 bg-white/5">
            <CardContent className="py-4">
              {service.external ? (
                <a
                  href={service.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-amber-400 hover:underline"
                >
                  {service.label}
                </a>
              ) : (
                <a href={service.href} className="text-sm font-medium text-amber-400 hover:underline">
                  {service.label}
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CabinetServices;
