
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Award } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CalculatorNavigation from "@/components/CalculatorNavigation";

const formSchema = z.object({
  currentAge: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(18, { message: "Current age must be at least 18" }).max(65, { message: "Current age cannot exceed 65" })
  ),
  monthlyContribution: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(500, { message: "Monthly contribution must be at least ₹500" })
  ),
  expectedReturn: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(8, { message: "Expected return must be at least 8%" }).max(15, { message: "Expected return cannot exceed 15%" })
  ),
  annuityRate: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(4, { message: "Annuity rate must be at least 4%" }).max(10, { message: "Annuity rate cannot exceed 10%" })
  ),
});

type NPSFormValues = z.infer<typeof formSchema>;

const NPSCalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);

  const form = useForm<NPSFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentAge: 30,
      monthlyContribution: 5000,
      expectedReturn: 10,
      annuityRate: 6,
    },
  });

  const calculateNPS = (currentAge: number, monthlyContribution: number, expectedReturn: number, annuityRate: number) => {
    const retirementAge = 60;
    const yearsToRetirement = retirementAge - currentAge;
    const totalMonths = yearsToRetirement * 12;
    const monthlyReturn = expectedReturn / 12 / 100;
    
    // Calculate corpus at retirement
    const corpusAtRetirement = monthlyContribution * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn);
    const totalInvestment = monthlyContribution * totalMonths;
    const totalReturns = corpusAtRetirement - totalInvestment;
    
    // NPS rules: 60% can be withdrawn, 40% must be used for annuity
    const lumpSumWithdrawal = corpusAtRetirement * 0.6;
    const annuityAmount = corpusAtRetirement * 0.4;
    const monthlyPension = (annuityAmount * annuityRate / 100) / 12;
    
    return {
      currentAge,
      monthlyContribution,
      expectedReturn,
      annuityRate,
      yearsToRetirement,
      totalInvestment,
      corpusAtRetirement,
      totalReturns,
      lumpSumWithdrawal,
      annuityAmount,
      monthlyPension,
    };
  };

  const handleCalculationComplete = (results: any) => {
    setCalculationResults(results);
    console.log("NPS Calculation results:", results);
  };

  const onSubmit = (values: NPSFormValues) => {
    try {
      const results = calculateNPS(
        values.currentAge,
        values.monthlyContribution,
        values.expectedReturn,
        values.annuityRate
      );
      handleCalculationComplete(results);
    } catch (error) {
      console.error("NPS Calculation error:", error);
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
              <CardTitle>NPS Calculator</CardTitle>
              <CardDescription>Calculate your National Pension Scheme returns and pension amount</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="currentAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Age</FormLabel>
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
                    name="monthlyContribution"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Contribution (₹)</FormLabel>
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
                    name="expectedReturn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Expected Annual Return (%)</FormLabel>
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
                    name="annuityRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Annuity Rate (%)</FormLabel>
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
                  
                  <Button type="submit" className="w-full">Calculate NPS Returns</Button>
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
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Corpus at Retirement</h3>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculationResults.corpusAtRetirement)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Lump Sum (60%)</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(calculationResults.lumpSumWithdrawal)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly Pension</h3>
                    <p className="text-2xl font-bold text-purple-600">{formatCurrency(calculationResults.monthlyPension)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Total Returns</h3>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(calculationResults.totalReturns)}</p>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">NPS Investment Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Total Investment:</span>
                      <span className="ml-2 font-medium">{formatCurrency(calculationResults.totalInvestment)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Years to Retirement:</span>
                      <span className="ml-2 font-medium">{calculationResults.yearsToRetirement} years</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Annuity Amount (40%):</span>
                      <span className="ml-2 font-medium">{formatCurrency(calculationResults.annuityAmount)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected Return:</span>
                      <span className="ml-2 font-medium">{calculationResults.expectedReturn}% p.a.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NPSCalculatorPage;
