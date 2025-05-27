
import { useState } from "react";
import { TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CalculatorNavigation from "@/components/CalculatorNavigation";

const InflationCalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 p-4 border-b">
        <CalculatorNavigation />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Inflation Calculator</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Calculate the future value of money considering inflation
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Amount</label>
                <Input className="w-full mt-1" placeholder="₹1,00,000" />
              </div>
              <div>
                <label className="text-sm font-medium">Inflation Rate (% p.a.)</label>
                <Input className="w-full mt-1" placeholder="6%" />
              </div>
              <div>
                <label className="text-sm font-medium">Time Period (Years)</label>
                <Input className="w-full mt-1" placeholder="10" />
              </div>
              <Button className="w-full">Calculate Future Value</Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
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
        </div>
      </div>
    </div>
  );
};

export default InflationCalculatorPage;
