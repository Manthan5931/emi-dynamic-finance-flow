
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Info } from "lucide-react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { calculateSIP } from "@/lib/sip-calculator";

const formSchema = z.object({
  monthlyInvestment: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(500, { message: "Monthly investment must be at least ₹500" })
  ),
  expectedReturn: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1, { message: "Expected return must be at least 1%" }).max(30, { message: "Expected return cannot exceed 30%" })
  ),
  timePeriod: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().int().min(1, { message: "Investment period must be at least 1 year" }).max(30, { message: "Investment period cannot exceed 30 years" })
  ),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  inflationRate: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0, { message: "Inflation rate must be at least 0%" }).max(15, { message: "Inflation rate cannot exceed 15%" }).optional().default(0)
  ),
});

type SIPFormValues = z.infer<typeof formSchema>;

interface SIPCalculatorProps {
  onCalculationComplete: (results: any) => void;
}

const SIPCalculator = ({ onCalculationComplete }: SIPCalculatorProps) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const form = useForm<SIPFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlyInvestment: 10000,
      expectedReturn: 12,
      timePeriod: 10,
      startDate: new Date(),
      inflationRate: 5,
    },
  });

  const onSubmit = (values: SIPFormValues) => {
    try {
      const { monthlyInvestment, expectedReturn, timePeriod, startDate, inflationRate } = values;
      
      // Calculate SIP returns
      const results = calculateSIP(
        monthlyInvestment, 
        expectedReturn, 
        timePeriod, 
        inflationRate || 0
      );
      
      // Add start date to results
      const calculationResults = {
        ...results,
        startDate,
        monthlyInvestment,
        expectedReturn,
        timePeriod,
        inflationRate: inflationRate || 0,
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
          <span>SIP Investment Details</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Enter your SIP details to calculate returns and generate investment schedule</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>Enter investment details to calculate your SIP returns</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="monthlyInvestment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Investment (₹)</FormLabel>
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
              name="expectedReturn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Return (% per annum)</FormLabel>
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
            
            <FormField
              control={form.control}
              name="timePeriod"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Period (Years)</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Input 
                        type="number" 
                        {...field} 
                        onChange={(e) => field.onChange(e.target.valueAsNumber || "")} 
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                      />
                      <Slider
                        defaultValue={[field.value]}
                        min={1}
                        max={30}
                        step={1}
                        onValueChange={(val) => field.onChange(val[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1</span>
                        <span>15</span>
                        <span>30</span>
                      </div>
                    </div>
                  </FormControl>
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
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              >
                <Plus className="h-4 w-4" />
                <span>Advanced Options</span>
              </Button>
            </div>
            
            {showAdvancedOptions && (
              <FormField
                control={form.control}
                name="inflationRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Inflation Rate (% per annum)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Input 
                          type="number" 
                          step="0.1" 
                          {...field} 
                          onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                        />
                        <span className="text-sm font-medium">%</span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      This helps calculate the inflation-adjusted value of your investment.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Button type="submit" className="w-full">Calculate</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0">
        <div>
          <p className="font-semibold mb-1">SIP Calculation Formula:</p>
          <p className="font-mono bg-muted p-2 rounded text-xs">
            M × (((1+r)^n-1)/r) × (1+r)
          </p>
          <p className="mt-2">
            Where:
            <br />M = Monthly investment
            <br />r = Monthly rate of return (annual rate ÷ 12 ÷ 100)
            <br />n = Number of months (years × 12)
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SIPCalculator;
