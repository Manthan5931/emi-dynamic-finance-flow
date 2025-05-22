
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoanCalculator from "@/components/LoanCalculator";
import EMISchedule from "@/components/EMISchedule";
import LoanCharts from "@/components/LoanCharts";
import LoanSummary from "@/components/LoanSummary";
import ThemeToggle from "@/components/ThemeToggle";
import FAQ from "@/components/FAQ";
import Features from "@/components/Features";
import LoanTips from "@/components/LoanTips";

const Index = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);
  const { toast } = useToast();
  
  const handleCalculationComplete = (results: any) => {
    setCalculationResults(results);
    toast({
      title: "Calculation Complete",
      description: "Your EMI schedule has been generated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 animate-fade-in">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">EMI Calculator</h1>
            <p className="text-muted-foreground mt-2">Plan your loan repayments with precision</p>
          </div>
          <ThemeToggle />
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-1">
            <LoanCalculator onCalculationComplete={handleCalculationComplete} />
          </div>
          
          <div className="lg:col-span-2">
            {calculationResults ? (
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="summary">Loan Summary</TabsTrigger>
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                  <TabsTrigger value="schedule">EMI Schedule</TabsTrigger>
                </TabsList>
                
                <TabsContent value="summary" className="animate-fade-in">
                  <LoanSummary data={calculationResults} />
                </TabsContent>
                
                <TabsContent value="charts" className="animate-fade-in">
                  <LoanCharts data={calculationResults} />
                </TabsContent>
                
                <TabsContent value="schedule" className="animate-fade-in">
                  <EMISchedule data={calculationResults} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="h-full flex items-center justify-center p-12 border rounded-lg bg-muted/30">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Enter loan details to calculate EMI</h3>
                  <p className="text-muted-foreground">Fill in the loan amount, interest rate, tenure, and start date to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {calculationResults && (
          <div className="space-y-8 mt-6">
            <Features />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <FAQ />
              <LoanTips />
            </div>
          </div>
        )}
        
        <footer className="mt-12 text-center text-sm text-muted-foreground border-t pt-6">
          <p>© {new Date().getFullYear()} EMI Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
