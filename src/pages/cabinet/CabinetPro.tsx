import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { useCabinetOutletContext } from "./CabinetLayout";
import { useCabinetQuery } from "@/features/cabinet/useCabinetQuery";
import type { ProStatsPeriod, ProStatsResponseData } from "@/features/cabinet/types";
import type { CabinetTranslation } from "@/features/cabinet/i18n";

const signed = (value: number) => (value > 0 ? "+" : "");

const PeriodCard = ({
  label,
  period,
  t,
}: {
  label: string;
  period: ProStatsPeriod;
  t: CabinetTranslation;
}) => (
  <Card className="border-border bg-card">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-1">
      <p className="text-2xl font-bold text-foreground">
        {signed(period.totalR)}
        {period.totalR}R
      </p>
      <p className="text-xs text-muted-foreground">
        {t("proStatsClosed")}: {period.closed} · {t("proStatsWinRate")}: {period.winRate}%
      </p>
    </CardContent>
  </Card>
);

const CabinetPro = () => {
  const { session, language, t, updateSession } = useCabinetOutletContext();

  const { data, isLoading } = useCabinetQuery<ProStatsResponseData>({
    action: "pro_stats",
    session,
    language,
    onRenewedToken: updateSession,
  });

  const isActive = data?.isActive === true;
  const stats = data?.proStats;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gradient-gold">{t("proTitle")}</h1>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> {t("loading")}
        </div>
      ) : !isActive ? (
        <Card className="border-border bg-card">
          <CardContent className="space-y-3 pt-6">
            <p className="text-sm text-muted-foreground">{t("proLeadInactive")}</p>
            <Button asChild variant="outline">
              <Link to="/cabinet/subscription">{t("proGoSubscription")}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="text-sm text-muted-foreground">{t("proLeadActive")}</p>

          {stats && (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <PeriodCard label={t("proStatsPeriod7d")} period={stats.summary.d7} t={t} />
                <PeriodCard label={t("proStatsPeriod30d")} period={stats.summary.d30} t={t} />
                <PeriodCard label={t("proStatsPeriodAllTime")} period={stats.summary.allTime} t={t} />
              </div>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("proStatsBySymbolTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.bySymbol.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("proStatsNoTrades")}</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("proStatsColSymbol")}</TableHead>
                          <TableHead>{t("proStatsClosed")}</TableHead>
                          <TableHead>{t("proStatsWinRate")}</TableHead>
                          <TableHead>{t("proStatsTotalR")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.bySymbol.map((row) => (
                          <TableRow key={row.symbol}>
                            <TableCell className="font-medium">{row.symbol}</TableCell>
                            <TableCell>{row.closed}</TableCell>
                            <TableCell>{row.winRate}%</TableCell>
                            <TableCell>
                              {signed(row.totalR)}
                              {row.totalR}R
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {t("proStatsRecentTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.recentTrades.length === 0 ? (
                    <p className="text-sm text-muted-foreground">{t("proStatsNoTrades")}</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("proStatsColSymbol")}</TableHead>
                          <TableHead>{t("proStatsColDirection")}</TableHead>
                          <TableHead>{t("proStatsColResult")}</TableHead>
                          <TableHead>{t("proStatsColDate")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.recentTrades.map((trade, index) => (
                          <TableRow key={`${trade.symbol}-${trade.closedAt}-${index}`}>
                            <TableCell className="font-medium">{trade.symbol}</TableCell>
                            <TableCell>{trade.direction}</TableCell>
                            <TableCell
                              className={trade.realizedR > 0 ? "text-emerald-700" : "text-rose-700"}
                            >
                              {signed(trade.realizedR)}
                              {trade.realizedR}R
                            </TableCell>
                            <TableCell>{new Date(trade.closedAt).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CabinetPro;
