
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoanCalculator from "@/components/LoanCalculator";
import EMISchedule from "@/components/EMISchedule";
import LoanCharts from "@/components/LoanCharts";
import LoanSummary from "@/components/LoanSummary";
import ThemeToggle from "@/components/ThemeToggle";

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
      <div className="container mx-auto p-4 md:p-6 animate-fade-in">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">EMI Calculator</h1>
          <ThemeToggle />
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <LoanCalculator onCalculationComplete={handleCalculationComplete} />
          </div>
          
          <div className="lg:col-span-2">
            {calculationResults && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
