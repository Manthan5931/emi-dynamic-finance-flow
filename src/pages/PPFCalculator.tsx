
import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CalculatorNavigation from "@/components/CalculatorNavigation";

const PPFCalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 p-4 border-b">
        <CalculatorNavigation />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card p-6 rounded-lg border">
            <h2 className="text-xl font-semibold mb-4">PPF Calculator</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Calculate your Public Provident Fund returns over 15 years
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Annual Investment</label>
                <Input className="w-full mt-1" placeholder="₹1,50,000" />
              </div>
              <div>
                <label className="text-sm font-medium">Current PPF Interest Rate</label>
                <Input className="w-full mt-1" placeholder="7.1%" />
              </div>
              <div>
                <label className="text-sm font-medium">Investment Period</label>
                <Select>
                  <SelectTrigger className="w-full mt-1">
                    <SelectValue placeholder="15 years (minimum)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 years (minimum)</SelectItem>
                    <SelectItem value="20">20 years</SelectItem>
                    <SelectItem value="25">25 years</SelectItem>
                    <SelectItem value="30">30 years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Calculate PPF Returns</Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/30 rounded-lg border-2 border-dashed h-96">
            <h2 className="text-2xl font-bold mb-2">Calculate Your PPF Returns</h2>
            <p className="text-muted-foreground mb-6">
              Plan your long-term savings with Public Provident Fund
            </p>
            <div className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center mb-4 animate-pulse">
              <Shield className="w-12 h-12 text-green-500" />
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              PPF offers tax benefits and guaranteed returns for your retirement planning
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PPFCalculatorPage;
