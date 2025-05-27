
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Target } from "lucide-react";
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
  retirementAge: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(50, { message: "Retirement age must be at least 50" }).max(75, { message: "Retirement age cannot exceed 75" })
  ),
  monthlyExpenses: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(10000, { message: "Monthly expenses must be at least ₹10,000" })
  ),
  expectedReturn: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(5, { message: "Expected return must be at least 5%" }).max(20, { message: "Expected return cannot exceed 20%" })
  ),
  inflationRate: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(2, { message: "Inflation rate must be at least 2%" }).max(15, { message: "Inflation rate cannot exceed 15%" })
  ),
}).refine((data) => data.retirementAge > data.currentAge, {
  message: "Retirement age must be greater than current age",
  path: ["retirementAge"],
});

type RetirementFormValues = z.infer<typeof formSchema>;

const RetirementCalculatorPage = () => {
  const [calculationResults, setCalculationResults] = useState<any>(null);

  const form = useForm<RetirementFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentAge: 30,
      retirementAge: 60,
      monthlyExpenses: 50000,
      expectedReturn: 12,
      inflationRate: 6,
    },
  });

  const calculateRetirement = (
    currentAge: number,
    retirementAge: number,
    monthlyExpenses: number,
    expectedReturn: number,
    inflationRate: number
  ) => {
    const yearsToRetirement = retirementAge - currentAge;
    const postRetirementYears = 25; // Assuming 25 years after retirement
    
    // Calculate future monthly expenses considering inflation
    const futureMonthlyExpenses = monthlyExpenses * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    
    // Calculate corpus needed at retirement (considering post-retirement inflation)
    const realReturnRate = (expectedReturn - inflationRate) / 100;
    const corpusNeeded = futureMonthlyExpenses * 12 * postRetirementYears / (1 + realReturnRate);
    
    // Calculate monthly SIP needed
    const monthlyReturn = expectedReturn / 12 / 100;
    const totalMonths = yearsToRetirement * 12;
    const monthlySIPNeeded = corpusNeeded * monthlyReturn / (Math.pow(1 + monthlyReturn, totalMonths) - 1);
    
    return {
      currentAge,
      retirementAge,
      yearsToRetirement,
      currentMonthlyExpenses: monthlyExpenses,
      futureMonthlyExpenses,
      corpusNeeded,
      monthlySIPNeeded,
      expectedReturn,
      inflationRate,
    };
  };

  const handleCalculationComplete = (results: any) => {
    setCalculationResults(results);
    console.log("Retirement Calculation results:", results);
  };

  const onSubmit = (values: RetirementFormValues) => {
    try {
      const results = calculateRetirement(
        values.currentAge,
        values.retirementAge,
        values.monthlyExpenses,
        values.expectedReturn,
        values.inflationRate
      );
      handleCalculationComplete(results);
    } catch (error) {
      console.error("Retirement Calculation error:", error);
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
              <CardTitle>Retirement Calculator</CardTitle>
              <CardDescription>Plan how much you need to save for a comfortable retirement</CardDescription>
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
                    name="retirementAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Retirement Age</FormLabel>
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
                    name="monthlyExpenses"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Monthly Expenses (₹)</FormLabel>
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
                        <FormLabel>Expected Return (% p.a.)</FormLabel>
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
                    name="inflationRate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Inflation Rate (% p.a.)</FormLabel>
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
                  
                  <Button type="submit" className="w-full">Calculate Retirement Corpus</Button>
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
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Corpus Needed</h3>
                    <p className="text-2xl font-bold text-blue-600">{formatCurrency(calculationResults.corpusNeeded)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Monthly SIP Required</h3>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(calculationResults.monthlySIPNeeded)}</p>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Years to Retirement</h3>
                    <p className="text-2xl font-bold text-purple-600">{calculationResults.yearsToRetirement}</p>
                  </div>
                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-lg border">
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Future Monthly Expenses</h3>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(calculationResults.futureMonthlyExpenses)}</p>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-6 rounded-lg border">
                  <h3 className="font-semibold mb-4">Retirement Planning Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Expected Return:</span>
                      <span className="ml-2 font-medium">{calculationResults.expectedReturn}% p.a.</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Inflation Rate:</span>
                      <span className="ml-2 font-medium">{calculationResults.inflationRate}% p.a.</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementCalculatorPage;
