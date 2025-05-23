
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface SIPSummaryProps {
  results: {
    monthlyInvestment: number;
    totalInvestment: number;
    totalReturns: number;
    maturityValue: number;
    inflationAdjustedValue: number;
    timePeriod: number;
    expectedReturn: number;
    inflationRate: number;
    startDate: Date;
  };
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const SIPSummary = ({ results }: SIPSummaryProps) => {
  const {
    monthlyInvestment,
    totalInvestment,
    totalReturns,
    maturityValue,
    inflationAdjustedValue,
    timePeriod,
    expectedReturn,
    inflationRate,
    startDate,
  } = results;

  const returnsPercentage = (totalReturns / totalInvestment) * 100;
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + timePeriod);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-900/10 rounded-t-lg pb-2">
          <CardTitle className="text-lg sm:text-xl font-bold text-center">SIP Investment Summary</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">Monthly Investment</p>
                <p className="text-base sm:text-lg font-semibold">{formatCurrency(monthlyInvestment)}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">Expected Return</p>
                <p className="text-base sm:text-lg font-semibold">{expectedReturn.toFixed(1)}% p.a.</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">Time Period</p>
                <p className="text-base sm:text-lg font-semibold">{timePeriod} years</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">Start Date</p>
                <p className="text-base sm:text-lg font-semibold">{format(startDate, "dd MMM yyyy")}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-900/10 rounded-t-lg pb-2">
          <CardTitle className="text-lg sm:text-xl font-bold text-center">Investment Returns</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="p-4 sm:p-6 space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">Total Invested</p>
                <p className="text-base sm:text-lg font-semibold">{formatCurrency(totalInvestment)}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">Estimated Returns</p>
                <p className="text-base sm:text-lg font-semibold text-green-600">{formatCurrency(totalReturns)}</p>
                <Badge variant="outline" className="text-xs mt-1">{returnsPercentage.toFixed(1)}%</Badge>
              </div>
              <div className="col-span-2 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/10 rounded-lg p-3 text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">Total Value</p>
                <p className="text-xl sm:text-2xl font-bold text-indigo-600">{formatCurrency(maturityValue)}</p>
                <p className="text-xs text-muted-foreground mt-1">Maturity on {format(endDate, "dd MMM yyyy")}</p>
              </div>
              {inflationRate > 0 && (
                <div className="col-span-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3 text-center">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Inflation-Adjusted Value <Badge variant="outline" className="ml-1">{inflationRate}% p.a.</Badge>
                  </p>
                  <p className="text-base sm:text-lg font-semibold">{formatCurrency(inflationAdjustedValue)}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SIPSummary;
