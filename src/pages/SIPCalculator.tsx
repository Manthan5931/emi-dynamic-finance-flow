
import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CalculatorNavigation from "@/components/CalculatorNavigation";
import SIPCalculator from "@/components/SIPCalculator";
import SIPSummary from "@/components/SIPSummary";
import SIPSchedule from "@/components/SIPSchedule";
import SIPCharts from "@/components/SIPCharts";
import SIPFeatures from "@/components/SIPFeatures";
import SIPFAQ from "@/components/SIPFAQ";
import SIPTips from "@/components/SIPTips";

const SIPCalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);

  const handleCalculationComplete = (results: any) => {
    setCalculationResults(results);
    console.log("SIP Calculation results:", results);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 p-4 border-b">
        <CalculatorNavigation />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-5 space-y-6">
          <SIPCalculator onCalculationComplete={handleCalculationComplete} />
          <div className="hidden lg:block">
            <SIPTips />
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
                  <SIPSummary results={calculationResults} />
                </TabsContent>
                <TabsContent value="schedule">
                  <SIPSchedule schedule={calculationResults.schedule} />
                </TabsContent>
                <TabsContent value="charts">
                  <SIPCharts results={calculationResults} />
                </TabsContent>
              </Tabs>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border-2 border-dashed h-96">
                <h2 className="text-2xl font-bold mb-2">Calculate Your SIP Returns</h2>
                <p className="text-muted-foreground mb-6">
                  Enter your investment details on the left to see how your money grows over time
                </p>
                <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4 animate-pulse">
                  <BarChart3 className="w-12 h-12 text-blue-500" />
                </div>
                <p className="max-w-md text-sm text-muted-foreground">
                  Our calculator helps you visualize the power of compounding and see how your SIP investments can help you achieve your financial goals
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-10 mt-10">
        <SIPFeatures />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:hidden">
            <SIPTips />
          </div>
          <SIPFAQ />
        </div>
      </div>
    </div>
  );
};

export default SIPCalculatorPage;
