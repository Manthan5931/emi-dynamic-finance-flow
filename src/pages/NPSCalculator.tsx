
import { useState } from "react";
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalculatorNavigation from "@/components/CalculatorNavigation";

const NPSCalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 p-4 border-b">
        <CalculatorNavigation />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">NPS Calculator</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Calculate your National Pension Scheme returns and pension amount
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Current Age</label>
                <input className="w-full mt-1 p-2 border rounded" placeholder="30" />
              </div>
              <div>
                <label className="text-sm font-medium">Monthly Contribution</label>
                <input className="w-full mt-1 p-2 border rounded" placeholder="₹5,000" />
              </div>
              <div>
                <label className="text-sm font-medium">Expected Annual Return</label>
                <input className="w-full mt-1 p-2 border rounded" placeholder="10%" />
              </div>
              <div>
                <label className="text-sm font-medium">Annuity Rate</label>
                <input className="w-full mt-1 p-2 border rounded" placeholder="6%" />
              </div>
              <Button className="w-full">Calculate NPS Returns</Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border-2 border-dashed h-96">
            <h2 className="text-2xl font-bold mb-2">Calculate Your NPS Returns</h2>
            <p className="text-muted-foreground mb-6">
              Plan your retirement with National Pension Scheme benefits
            </p>
            <div className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center mb-4 animate-pulse">
              <Award className="w-12 h-12 text-yellow-500" />
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              NPS offers tax benefits and market-linked returns for retirement planning
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NPSCalculatorPage;
