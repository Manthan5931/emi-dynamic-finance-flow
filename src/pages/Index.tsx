
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoanCalculator from "@/components/LoanCalculator";
import LoanSummary from "@/components/LoanSummary";
import EMISchedule from "@/components/EMISchedule";
import LoanCharts from "@/components/LoanCharts";
import ThemeToggle from "@/components/ThemeToggle";
import Features from "@/components/Features";
import FAQ from "@/components/FAQ";
import LoanTips from "@/components/LoanTips";
import { Calculator } from "lucide-react";

// Define types based on what the components expect
interface CalculationResults {
  loanAmount: number;
  interestRate: number;
  loanTenure: number;
  emi: number;
  totalAmount: number;
  totalInterest: number;
  totalPrepayment: number;
  startDate: Date;
  lastPaymentDate: string;
  schedule: Array<{
    month: number;
    date: string;
    rawDate: Date;
    principalPayment: number;
    interestPayment: number;
    emi: number;
    prepayment: number;
    totalPayment: number;
    principalPaid: number;
    balance: number;
    interestRate: number;
  }>;
}

export default function Index() {
  const [calculationResults, setCalculationResults] = useState<CalculationResults | null>(null);

  const handleCalculationComplete = (results: CalculationResults) => {
    setCalculationResults(results);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">EMI Calculator</h1>
        <div className="flex items-center gap-2">
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
          <LoanCalculator onCalculationComplete={handleCalculationComplete} />
          <div className="hidden lg:block">
            <LoanTips />
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-col gap-6">
            {calculationResults ? (
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                </TabsList>
                <TabsContent value="summary">
                  <LoanSummary data={calculationResults} />
                </TabsContent>
                <TabsContent value="schedule">
                  <EMISchedule data={calculationResults} />
                </TabsContent>
                <TabsContent value="charts">
                  <LoanCharts results={calculationResults} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border-2 border-dashed h-96">
                <h2 className="text-2xl font-bold mb-2">Calculate Your EMI</h2>
                <p className="text-muted-foreground mb-6">
                  Enter your loan details on the left to calculate your EMI and view payment schedule
                </p>
                <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4 animate-pulse">
                  <Calculator className="w-12 h-12 text-blue-500" />
                </div>
                <p className="max-w-md text-sm text-muted-foreground">
                  Our calculator helps you understand your loan payments and plan your finances better
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-10 mt-10">
        <Features />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:hidden">
            <LoanTips />
          </div>
          <FAQ />
        </div>
      </div>
    </div>
  );
}
