
import { useState } from "react";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CalculatorNavigation from "@/components/CalculatorNavigation";

const RetirementCalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 p-4 border-b">
        <CalculatorNavigation />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Retirement Calculator</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Plan how much you need to save for a comfortable retirement
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Age</label>
                <Input className="w-full mt-1" placeholder="30" />
              </div>
              <div>
                <label className="text-sm font-medium">Retirement Age</label>
                <Input className="w-full mt-1" placeholder="60" />
              </div>
              <div>
                <label className="text-sm font-medium">Current Monthly Expenses</label>
                <Input className="w-full mt-1" placeholder="₹50,000" />
              </div>
              <div>
                <label className="text-sm font-medium">Expected Return (% p.a.)</label>
                <Input className="w-full mt-1" placeholder="12%" />
              </div>
              <div>
                <label className="text-sm font-medium">Inflation Rate (% p.a.)</label>
                <Input className="w-full mt-1" placeholder="6%" />
              </div>
              <Button className="w-full">Calculate Retirement Corpus</Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border-2 border-dashed h-96">
            <h2 className="text-2xl font-bold mb-2">Plan Your Retirement</h2>
            <p className="text-muted-foreground mb-6">
              Calculate how much you need to save for your golden years
            </p>
            <div className="w-24 h-24 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center mb-4 animate-pulse">
              <Target className="w-12 h-12 text-purple-500" />
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Start planning early to build a substantial retirement corpus
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculatorPage;
