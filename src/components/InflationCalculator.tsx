
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  currentAmount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(100, { message: "Current amount must be at least ₹100" })
  ),
  inflationRate: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0.1, { message: "Inflation rate must be at least 0.1%" }).max(20, { message: "Inflation rate cannot exceed 20%" })
  ),
  timePeriod: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Time period must be at least 1 year" }).max(50, { message: "Time period cannot exceed 50 years" })
  )
});

type InflationFormValues = z.infer<typeof formSchema>;

interface InflationCalculatorProps {
  onCalculationComplete: (results: any) => void;
}

const InflationCalculator = ({ onCalculationComplete }: InflationCalculatorProps) => {
  const form = useForm<InflationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentAmount: 100000,
      inflationRate: 6,
      timePeriod: 10,
    },
  });

  const calculateInflation = (currentAmount: number, inflationRate: number, years: number) => {
    const rate = inflationRate / 100;
    const futureValue = currentAmount * Math.pow(1 + rate, years);
    const purchasingPowerLoss = futureValue - currentAmount;
    const realValue = currentAmount;
    
    return {
      currentAmount,
      inflationRate,
      timePeriod: years,
      futureValue,
      purchasingPowerLoss,
      realValue,
      inflationImpact: ((futureValue - currentAmount) / currentAmount * 100)
    };
  };

  const onSubmit = (values: InflationFormValues) => {
    try {
      const results = calculateInflation(values.currentAmount, values.inflationRate, values.timePeriod);
      onCalculationComplete(results);
    } catch (error) {
      console.error("Inflation Calculation error:", error);
    }
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle>Inflation Calculator</CardTitle>
        <CardDescription>Calculate the future value of money considering inflation</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="currentAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Amount (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                      className="bg-background dark:bg-gray-800 border-gray-300 dark:border-gray-600"
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
                      className="bg-background dark:bg-gray-800 border-gray-300 dark:border-gray-600"
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
                      className="bg-background dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">Calculate Future Value</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default InflationCalculator;
