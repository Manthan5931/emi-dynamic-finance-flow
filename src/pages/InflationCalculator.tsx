
import { useState } from "react";
import { TrendingDown } from "lucide-react";
import CalculatorNavigation from "@/components/CalculatorNavigation";
import InflationCalculator from "@/components/InflationCalculator";

const InflationCalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);

  const handleCalculationComplete = (results: any) => {
    setCalculationResults(results);
    console.log("Inflation Calculation results:", results);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 p-4 border-b">
        <CalculatorNavigation />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-5 space-y-6">
          <InflationCalculator onCalculationComplete={handleCalculationComplete} />
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-col gap-6">
            {calculationResults ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Current Value</h3>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculationResults.currentAmount)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Future Value Needed</h3>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(calculationResults.futureValue)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Purchasing Power Loss</h3>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(calculationResults.purchasingPowerLoss)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Inflation Impact</h3>
                    <p className="text-2xl font-bold text-purple-600">{calculationResults.inflationImpact.toFixed(1)}%</p>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Inflation Analysis</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Today's {formatCurrency(calculationResults.currentAmount)} will need </span>
                      <span className="font-medium">{formatCurrency(calculationResults.futureValue)}</span>
                      <span className="text-muted-foreground"> after {calculationResults.timePeriod} years</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Inflation Rate: </span>
                      <span className="font-medium">{calculationResults.inflationRate}% per annum</span>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border-2 border-dashed h-96">
                <h2 className="text-2xl font-bold mb-2">Calculate Inflation Impact</h2>
                <p className="text-muted-foreground mb-6">
                  Understand how inflation affects your money's purchasing power
                </p>
                <div className="w-24 h-24 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center mb-4 animate-pulse">
                  <TrendingDown className="w-12 h-12 text-orange-500" />
                </div>
                <p className="max-w-md text-sm text-muted-foreground">
                  Plan your investments to beat inflation and preserve wealth
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InflationCalculatorPage;
