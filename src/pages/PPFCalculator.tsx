
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Shield } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CalculatorNavigation from "@/components/CalculatorNavigation";

const formSchema = z.object({
  annualInvestment: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(500, { message: "Annual investment must be at least ₹500" }).max(150000, { message: "Annual investment cannot exceed ₹1,50,000" })
  ),
  interestRate: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Interest rate must be at least 1%" }).max(15, { message: "Interest rate cannot exceed 15%" })
  ),
  investmentPeriod: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(15, { message: "PPF minimum period is 15 years" }).max(50, { message: "Investment period cannot exceed 50 years" })
  ),
});

type PPFFormValues = z.infer<typeof formSchema>;

const PPFCalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);

  const form = useForm<PPFFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      annualInvestment: 150000,
      interestRate: 7.1,
      investmentPeriod: 15,
    },
  });

  const calculatePPF = (annualInvestment: number, rate: number, years: number) => {
    const totalInvestment = annualInvestment * years;
    let maturityAmount = 0;
    
    // PPF calculation with annual compounding
    for (let i = 1; i <= years; i++) {
      maturityAmount += annualInvestment * Math.pow(1 + rate / 100, years - i + 1);
    }
    
    const totalReturns = maturityAmount - totalInvestment;
    
    return {
      annualInvestment,
      interestRate: rate,
      investmentPeriod: years,
      totalInvestment,
      maturityAmount,
      totalReturns,
    };
  };

  const handleCalculationComplete = (results: any) => {
    setCalculationResults(results);
    console.log("PPF Calculation results:", results);
  };

  const onSubmit = (values: PPFFormValues) => {
    try {
      const results = calculatePPF(values.annualInvestment, values.interestRate, values.investmentPeriod);
      handleCalculationComplete(results);
    } catch (error) {
      console.error("PPF Calculation error:", error);
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8 p-4 border-b">
        <CalculatorNavigation />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
        <div className="lg:col-span-5 space-y-6">
          <Card className="w-full shadow-lg">
            <CardHeader>
              <CardTitle>PPF Calculator</CardTitle>
              <CardDescription>Calculate your Public Provident Fund returns over 15 years</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="annualInvestment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Investment (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="interestRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current PPF Interest Rate (%)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="investmentPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investment Period (Years)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                            className="bg-background"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">Calculate PPF Returns</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-7">
          <div className="flex flex-col gap-6">
            {calculationResults ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Annual Investment</h3>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculationResults.annualInvestment)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Maturity Amount</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(calculationResults.maturityAmount)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Investment</h3>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(calculationResults.totalInvestment)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Returns</h3>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(calculationResults.totalReturns)}</p>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">PPF Investment Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Interest Rate:</span>
                      <span className="ml-2 font-medium">{calculationResults.interestRate}% p.a.</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Investment Period:</span>
                      <span className="ml-2 font-medium">{calculationResults.investmentPeriod} years</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PPFCalculatorPage;
