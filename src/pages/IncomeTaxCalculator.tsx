
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Receipt } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CalculatorNavigation from "@/components/CalculatorNavigation";

const formSchema = z.object({
  taxRegime: z.enum(["old", "new"]),
  annualIncome: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(100000, { message: "Annual income must be at least ₹1,00,000" })
  ),
  deductions80C: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, { message: "Deductions cannot be negative" }).max(150000, { message: "80C deductions cannot exceed ₹1,50,000" })
  ),
  otherDeductions: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, { message: "Other deductions cannot be negative" })
  ),
});

type TaxFormValues = z.infer<typeof formSchema>;

const IncomeTaxCalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);

  const form = useForm<TaxFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taxRegime: "old",
      annualIncome: 1000000,
      deductions80C: 150000,
      otherDeductions: 50000,
    },
  });

  const calculateTax = (regime: string, income: number, deductions80C: number, otherDeductions: number) => {
    let taxableIncome = income;
    let totalDeductions = 0;
    
    if (regime === "old") {
      // Old regime with deductions
      totalDeductions = deductions80C + otherDeductions + 50000; // Standard deduction
      taxableIncome = Math.max(0, income - totalDeductions);
    } else {
      // New regime with standard deduction only
      totalDeductions = 50000; // Standard deduction in new regime
      taxableIncome = Math.max(0, income - totalDeductions);
    }
    
    let tax = 0;
    let cess = 0;
    
    if (regime === "old") {
      // Old regime tax slabs
      if (taxableIncome > 250000) {
        if (taxableIncome <= 500000) {
          tax = (taxableIncome - 250000) * 0.05;
        } else if (taxableIncome <= 1000000) {
          tax = 250000 * 0.05 + (taxableIncome - 500000) * 0.20;
        } else {
          tax = 250000 * 0.05 + 500000 * 0.20 + (taxableIncome - 1000000) * 0.30;
        }
      }
    } else {
      // New regime tax slabs (2024-25)
      if (taxableIncome > 300000) {
        if (taxableIncome <= 600000) {
          tax = (taxableIncome - 300000) * 0.05;
        } else if (taxableIncome <= 900000) {
          tax = 300000 * 0.05 + (taxableIncome - 600000) * 0.10;
        } else if (taxableIncome <= 1200000) {
          tax = 300000 * 0.05 + 300000 * 0.10 + (taxableIncome - 900000) * 0.15;
        } else if (taxableIncome <= 1500000) {
          tax = 300000 * 0.05 + 300000 * 0.10 + 300000 * 0.15 + (taxableIncome - 1200000) * 0.20;
        } else {
          tax = 300000 * 0.05 + 300000 * 0.10 + 300000 * 0.15 + 300000 * 0.20 + (taxableIncome - 1500000) * 0.30;
        }
      }
    }
    
    cess = tax * 0.04; // 4% health and education cess
    const totalTax = tax + cess;
    const netIncome = income - totalTax;
    
    return {
      regime,
      grossIncome: income,
      totalDeductions,
      taxableIncome,
      incomeTax: tax,
      cess,
      totalTax,
      netIncome,
      effectiveTaxRate: (totalTax / income) * 100,
    };
  };

  const handleCalculationComplete = (results: any) => {
    setCalculationResults(results);
    console.log("Tax Calculation results:", results);
  };

  const onSubmit = (values: TaxFormValues) => {
    try {
      const results = calculateTax(
        values.taxRegime,
        values.annualIncome,
        values.deductions80C,
        values.otherDeductions
      );
      handleCalculationComplete(results);
    } catch (error) {
      console.error("Tax Calculation error:", error);
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
              <CardTitle>Income Tax Calculator</CardTitle>
              <CardDescription>Calculate your income tax liability for FY 2024-25</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="taxRegime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tax Regime</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Select tax regime" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="old">Old Tax Regime</SelectItem>
                            <SelectItem value="new">New Tax Regime</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="annualIncome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annual Income (₹)</FormLabel>
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
                    name="deductions80C"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>80C Deductions (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                            className="bg-background"
                            disabled={form.watch("taxRegime") === "new"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="otherDeductions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Other Deductions (₹)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                            className="bg-background"
                            disabled={form.watch("taxRegime") === "new"}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full">Calculate Tax</Button>
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
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Gross Income</h3>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculationResults.grossIncome)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Tax</h3>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(calculationResults.totalTax)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Net Income</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(calculationResults.netIncome)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Effective Tax Rate</h3>
                    <p className="text-2xl font-bold text-purple-600">{calculationResults.effectiveTaxRate.toFixed(2)}%</p>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Tax Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxable Income:</span>
                      <span className="font-medium">{formatCurrency(calculationResults.taxableIncome)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Income Tax:</span>
                      <span className="font-medium">{formatCurrency(calculationResults.incomeTax)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Health & Education Cess:</span>
                      <span className="font-medium">{formatCurrency(calculationResults.cess)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Deductions:</span>
                      <span className="font-medium">{formatCurrency(calculationResults.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomeTaxCalculatorPage;
