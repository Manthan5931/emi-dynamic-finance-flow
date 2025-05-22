
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
        
        <section className="mb-12 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-100 dark:border-blue-900/30 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-6 md:p-10 flex flex-col justify-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Calculate Your EMI in Seconds
              </h2>
              <p className="text-lg mb-6">
                Make smarter financial decisions with our powerful EMI calculator. Get detailed payment breakdowns and visualizations.
              </p>
              <ul className="space-y-3 mb-8">
                {["Easy to use interface", "Detailed amortization schedule", "Visual payment breakdown", "Save and compare loan options"].map((item, i) => (
                  <li key={i} className="flex items-center">
                    <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                      <svg className="h-4 w-4 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <a href="#calculator" className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 text-sm font-medium shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1">
                  Get Started
                </a>
                <a href="#features" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1">
                  Learn More
                </a>
              </div>
            </div>
            <div className="hidden lg:block relative">
              <div className="absolute inset-0 bg-blue-600/10 backdrop-blur-sm"></div>
              <img 
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Financial planning" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>
        
        <div id="calculator" className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
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
              <div className="h-full flex flex-col items-center justify-center p-12 border rounded-lg bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10">
                <img 
                  src="https://illustrations.popsy.co/amber/calculator.svg" 
                  alt="Calculator" 
                  className="w-40 h-40 mb-6 animate-pulse"
                />
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Enter loan details to calculate EMI</h3>
                  <p className="text-muted-foreground">Fill in the loan amount, interest rate, tenure, and start date to get started</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div id="features" className="space-y-8 mt-6 mb-10">
          <Features />
        </div>
          
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <FAQ />
          <LoanTips />
        </div>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground border-t pt-6">
          <p>© {new Date().getFullYear()} EMI Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
