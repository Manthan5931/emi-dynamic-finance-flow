
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  monthlyDeposit: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(100, { message: "Monthly deposit must be at least ₹100" })
  ),
  interestRate: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Interest rate must be at least 1%" }).max(20, { message: "Interest rate cannot exceed 20%" })
  ),
  timePeriod: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Time period must be at least 1 year" }).max(50, { message: "Time period cannot exceed 50 years" })
  ),
});

type RDFormValues = z.infer<typeof formSchema>;

interface RDCalculatorProps {
  onCalculationComplete: (results: any) => void;
}

const RDCalculator = ({ onCalculationComplete }: RDCalculatorProps) => {
  const form = useForm<RDFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyDeposit: 5000,
      interestRate: 6.5,
      timePeriod: 5,
    },
  });

  const calculateRD = (monthlyDeposit: number, rate: number, years: number) => {
    const monthlyRate = rate / (12 * 100);
    const totalMonths = years * 12;
    
    // RD maturity formula: M = P * [((1 + r)^n - 1) / r] * (1 + r)
    const maturityAmount = monthlyDeposit * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
    const totalInvestment = monthlyDeposit * totalMonths;
    const totalReturns = maturityAmount - totalInvestment;
    
    return {
      monthlyDeposit,
      interestRate: rate,
      timePeriod: years,
      totalInvestment,
      maturityAmount,
      totalReturns,
    };
  };

  const onSubmit = (values: RDFormValues) => {
    try {
      const results = calculateRD(values.monthlyDeposit, values.interestRate, values.timePeriod);
      onCalculationComplete(results);
    } catch (error) {
      console.error("RD Calculation error:", error);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>RD Calculator</CardTitle>
        <CardDescription>Calculate returns on your Recurring Deposit with monthly contributions</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="monthlyDeposit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Deposit Amount (₹)</FormLabel>
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
                  <FormLabel>Interest Rate (% p.a.)</FormLabel>
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
              name="timePeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Period (Years)</FormLabel>
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
            
            <Button type="submit" className="w-full">Calculate RD Returns</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RDCalculator;
