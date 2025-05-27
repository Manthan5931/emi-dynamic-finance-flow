
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Info } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  principalAmount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1000, { message: "Principal amount must be at least ₹1,000" })
  ),
  interestRate: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Interest rate must be at least 1%" }).max(20, { message: "Interest rate cannot exceed 20%" })
  ),
  tenure: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Tenure must be at least 1" })
  ),
  tenureType: z.enum(["months", "years"]),
  compoundingFrequency: z.enum(["monthly", "quarterly", "half-yearly", "yearly"]),
  startDate: z.date({
    required_error: "Start date is required",
  }),
});

type FDFormValues = z.infer<typeof formSchema>;

interface FDCalculatorProps {
  onCalculationComplete: (results: any) => void;
}

const FDCalculator = ({ onCalculationComplete }: FDCalculatorProps) => {
  const form = useForm<FDFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principalAmount: 100000,
      interestRate: 6.5,
      tenure: 2,
      tenureType: "years",
      compoundingFrequency: "quarterly",
      startDate: new Date(),
    },
  });

  const calculateFD = (
    principal: number,
    rate: number,
    time: number,
    timeType: string,
    frequency: string
  ) => {
    // Convert time to years
    const timeInYears = timeType === "months" ? time / 12 : time;
    
    // Get compounding frequency
    const frequencyMap = {
      monthly: 12,
      quarterly: 4,
      "half-yearly": 2,
      yearly: 1
    };
    
    const n = frequencyMap[frequency as keyof typeof frequencyMap];
    const r = rate / 100;
    
    // Compound interest formula: A = P(1 + r/n)^(nt)
    const maturityAmount = principal * Math.pow(1 + r / n, n * timeInYears);
    const interestEarned = maturityAmount - principal;
    
    return {
      principalAmount: principal,
      interestRate: rate,
      tenure: time,
      tenureType: timeType,
      compoundingFrequency: frequency,
      maturityAmount,
      interestEarned,
      timeInYears
    };
  };

  const onSubmit = (values: FDFormValues) => {
    try {
      const results = calculateFD(
        values.principalAmount,
        values.interestRate,
        values.tenure,
        values.tenureType,
        values.compoundingFrequency
      );
      
      const calculationResults = {
        ...results,
        startDate: values.startDate,
      };
      
      onCalculationComplete(calculationResults);
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  return (
    <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Fixed Deposit Details</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Enter your FD details to calculate maturity amount and interest earned</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>Calculate your Fixed Deposit returns</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="principalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Principal Amount (₹)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary"
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
                  <FormLabel>Interest Rate (% per annum)</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-4">
                      <Input 
                        type="number" 
                        step="0.1" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.valueAsNumber || "")}
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm font-medium">%</span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tenure"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tenure</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.valueAsNumber || "")} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tenureType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="months">Months</SelectItem>
                        <SelectItem value="years">Years</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="compoundingFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Compounding Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="half-yearly">Half-yearly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full">Calculate FD Returns</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0">
        <div>
          <p className="font-semibold mb-1">Compound Interest Formula:</p>
          <p className="font-mono bg-muted p-2 rounded text-xs">
            A = P(1 + r/n)^(nt)
          </p>
          <p className="mt-2">
            Where:
            <br />A = Final amount
            <br />P = Principal amount
            <br />r = Annual interest rate
            <br />n = Compounding frequency
            <br />t = Time in years
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FDCalculator;
