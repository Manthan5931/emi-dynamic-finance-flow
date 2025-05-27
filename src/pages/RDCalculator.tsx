
import { useState } from "react";
import { Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CalculatorNavigation from "@/components/CalculatorNavigation";

const RDCalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 p-4 border-b">
        <CalculatorNavigation />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">RD Calculator</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Calculate returns on your Recurring Deposit with monthly contributions
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Monthly Deposit Amount</label>
                <Input className="w-full mt-1" placeholder="₹5,000" />
              </div>
              <div>
                <label className="text-sm font-medium">Interest Rate (% p.a.)</label>
                <Input className="w-full mt-1" placeholder="6.5" />
              </div>
              <div>
                <label className="text-sm font-medium">Time Period (Years)</label>
                <Input className="w-full mt-1" placeholder="5" />
              </div>
              <Button className="w-full">Calculate RD Returns</Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border-2 border-dashed h-96">
            <h2 className="text-2xl font-bold mb-2">Calculate Your RD Returns</h2>
            <p className="text-muted-foreground mb-6">
              Enter your Recurring Deposit details to calculate maturity amount
            </p>
            <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-4 animate-pulse">
              <Banknote className="w-12 h-12 text-blue-500" />
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Our calculator helps you plan your monthly savings with Recurring Deposits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RDCalculatorPage;
