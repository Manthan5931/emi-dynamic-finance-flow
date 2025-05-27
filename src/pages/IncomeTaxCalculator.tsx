
import { useState } from "react";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalculatorNavigation from "@/components/CalculatorNavigation";

const IncomeTaxCalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 p-4 border-b">
        <CalculatorNavigation />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">Income Tax Calculator</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Calculate your income tax liability for FY 2024-25
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tax Regime</label>
                <select className="w-full mt-1 p-2 border rounded">
                  <option>Old Tax Regime</option>
                  <option>New Tax Regime</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Annual Income</label>
                <input className="w-full mt-1 p-2 border rounded" placeholder="₹10,00,000" />
              </div>
              <div>
                <label className="text-sm font-medium">80C Deductions</label>
                <input className="w-full mt-1 p-2 border rounded" placeholder="₹1,50,000" />
              </div>
              <div>
                <label className="text-sm font-medium">Other Deductions</label>
                <input className="w-full mt-1 p-2 border rounded" placeholder="₹50,000" />
              </div>
              <Button className="w-full">Calculate Tax</Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border-2 border-dashed h-96">
            <h2 className="text-2xl font-bold mb-2">Calculate Your Income Tax</h2>
            <p className="text-muted-foreground mb-6">
              Know your tax liability and plan your investments accordingly
            </p>
            <div className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center mb-4 animate-pulse">
              <Receipt className="w-12 h-12 text-red-500" />
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Compare old vs new tax regime and optimize your tax planning
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeTaxCalculatorPage;
