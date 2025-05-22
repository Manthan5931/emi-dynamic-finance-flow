
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
import { calculateEMI, generateAmortizationSchedule } from "@/lib/emi-calculator";
import AdvancedOptions from "@/components/AdvancedOptions";

const formSchema = z.object({
  loanAmount: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(1000, { message: "Loan amount must be at least 1,000" })
  ),
  interestRate: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().min(0.1, { message: "Interest rate must be at least 0.1%" }).max(30, { message: "Interest rate cannot exceed 30%" })
  ),
  loanTenure: z.preprocess(
    (val) => (val === "" ? undefined : Number(val)),
    z.number().int().min(1, { message: "Loan tenure must be at least 1 year" }).max(30, { message: "Loan tenure cannot exceed 30 years" })
  ),
  startDate: z.date({
    required_error: "Start date is required",
  }),
});

type LoanFormValues = z.infer<typeof formSchema>;

interface LoanCalculatorProps {
  onCalculationComplete: (results: any) => void;
}

const LoanCalculator = ({ onCalculationComplete }: LoanCalculatorProps) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [prepayments, setPrepayments] = useState<any[]>([]);
  const [rateChanges, setRateChanges] = useState<any[]>([]);
  const [emiChanges, setEmiChanges] = useState<any[]>([]);

  const form = useForm<LoanFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      loanAmount: 2500000,
      interestRate: 8.5,
      loanTenure: 10,
      startDate: new Date(),
    },
  });

  const onSubmit = (values: LoanFormValues) => {
    try {
      const { loanAmount, interestRate, loanTenure, startDate } = values;
      const monthlyInterestRate = interestRate / 12 / 100;
      const totalMonths = loanTenure * 12;
      
      // Calculate EMI using the formula
      const emi = calculateEMI(loanAmount, interestRate, loanTenure);
      
      // Generate full amortization schedule
      const schedule = generateAmortizationSchedule(
        loanAmount, 
        interestRate, 
        loanTenure, 
        startDate,
        prepayments,
        rateChanges,
        emiChanges
      );
      
      // Calculate summary data
      const totalInterest = schedule.reduce((sum, month) => sum + month.interestPayment, 0);
      const totalAmount = loanAmount + totalInterest;
      const totalPrepayment = prepayments.reduce((sum, p) => sum + p.amount, 0);
      
      const results = {
        loanAmount,
        emi,
        interestRate,
        loanTenure,
        totalInterest,
        totalAmount,
        totalPrepayment,
        startDate,
        lastPaymentDate: schedule[schedule.length - 1].date,
        schedule,
        principalSum: loanAmount,
        interestSum: totalInterest,
        prepaymentSum: totalPrepayment,
      };
      
      onCalculationComplete(results);
    } catch (error) {
      console.error("Calculation error:", error);
    }
  };

  const handlePrepaymentUpdate = (newPrepayments: any[]) => {
    setPrepayments(newPrepayments);
  };

  const handleRateChangesUpdate = (newRateChanges: any[]) => {
    setRateChanges(newRateChanges);
  };

  const handleEmiChangesUpdate = (newEmiChanges: any[]) => {
    setEmiChanges(newEmiChanges);
  };

  return (
    <Card className="w-full shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Loan Details</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm">
                <p>Enter your loan details to calculate EMI and generate payment schedule</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
        <CardDescription>Enter loan details to calculate your EMI</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="loanAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Amount (₹)</FormLabel>
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
            
            <FormField
              control={form.control}
              name="loanTenure"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loan Tenure (Years)</FormLabel>
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
              <AdvancedOptions 
                onPrepaymentUpdate={handlePrepaymentUpdate}
                onRateChangeUpdate={handleRateChangesUpdate}
                onEmiChangeUpdate={handleEmiChangesUpdate}
              />
            )}
            
            <Button type="submit" className="w-full">Calculate</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground pt-0">
        <div>
          <p className="font-semibold mb-1">EMI Calculation Formula:</p>
          <p className="font-mono bg-muted p-2 rounded text-xs">
            EMI = [P × r × (1+r)^n] ÷ [(1+r)^n - 1]
          </p>
          <p className="mt-2">
            Where:
            <br />P = Principal loan amount
            <br />r = Monthly interest rate (annual rate ÷ 12 ÷ 100)
            <br />n = Total number of monthly payments (years × 12)
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoanCalculator;
