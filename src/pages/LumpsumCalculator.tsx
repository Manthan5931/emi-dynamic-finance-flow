
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ThemeToggle";
import LumpsumCalculator from "@/components/LumpsumCalculator";

const LumpsumCalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);

  const handleCalculationComplete = (results: any) => {
    setCalculationResults(results);
    console.log("Lumpsum Calculation results:", results);
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold">Lumpsum Calculator</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/">
            <Button variant="outline" size="sm">
              EMI Calculator
            </Button>
          </Link>
          <Link to="/sip-calculator">
            <Button variant="outline" size="sm">
              SIP Calculator
            </Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-5 space-y-6">
          <LumpsumCalculator onCalculationComplete={handleCalculationComplete} />
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-col gap-6">
            {calculationResults ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Investment Amount</h3>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculationResults.investmentAmount)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Future Value</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(calculationResults.futureValue)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Returns</h3>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(calculationResults.totalReturns)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Expected Return</h3>
                    <p className="text-2xl font-bold text-orange-600">{calculationResults.expectedReturn}% p.a.</p>
                  </div>
                </div>
                
                {calculationResults.inflationAdjustedValue && calculationResults.inflationRate > 0 && (
                  <div className="bg-muted/50 p-6 rounded-lg border">
                    <h3 className="font-semibold mb-2">Inflation Adjusted Value</h3>
                    <p className="text-lg font-medium text-muted-foreground">
                      {formatCurrency(calculationResults.inflationAdjustedValue)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Adjusted for {calculationResults.inflationRate}% annual inflation
                    </p>
                  </div>
                )}
                
                <div className="bg-muted/50 p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Investment Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Time Period:</span>
                      <span className="ml-2 font-medium">{calculationResults.timePeriod} years</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Growth Multiple:</span>
                      <span className="ml-2 font-medium">
                        {(calculationResults.futureValue / calculationResults.investmentAmount).toFixed(2)}x
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border-2 border-dashed h-96">
                <h2 className="text-2xl font-bold mb-2">Calculate Your Investment Returns</h2>
                <p className="text-muted-foreground mb-6">
                  Enter your lumpsum investment details on the left to see future value
                </p>
                <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4 animate-pulse">
                  <TrendingUp className="w-12 h-12 text-blue-500" />
                </div>
                <p className="max-w-md text-sm text-muted-foreground">
                  Our calculator helps you understand how your one-time investment will grow over time
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LumpsumCalculatorPage;
