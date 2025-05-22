
import { useState } from "react";
import { format } from "date-fns";
import { ChartPie, CircleInfo, Download, Share } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { formatCurrency, formatPercentage } from "@/lib/emi-calculator";
import { useToast } from "@/hooks/use-toast";

interface LoanSummaryProps {
  data: any;
}

const LoanSummary = ({ data }: LoanSummaryProps) => {
  const { toast } = useToast();
  const [isClient, setIsClient] = useState(false);
  
  // Make sure we're running on client side before rendering
  useState(() => {
    setIsClient(true);
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Loan Summary",
        text: `Loan Amount: ${formatCurrency(data.loanAmount)}\nEMI: ${formatCurrency(data.emi)}\nTotal Interest: ${formatCurrency(data.totalInterest)}`,
      })
      .then(() => {
        toast({
          title: "Shared Successfully",
          description: "Loan summary has been shared."
        });
      })
      .catch(() => {
        toast({
          title: "Share Cancelled",
          description: "Share operation was cancelled."
        });
      });
    } else {
      toast({
        title: "Share Not Supported",
        description: "Web Share API is not supported in your browser.",
        variant: "destructive"
      });
    }
  };
  
  const handleDownload = () => {
    const summaryText = `Loan Summary
Loan Amount: ${formatCurrency(data.loanAmount)}
Interest Rate: ${formatPercentage(data.interestRate)}
Loan Tenure: ${data.loanTenure} years
EMI: ${formatCurrency(data.emi)}
Total Interest: ${formatCurrency(data.totalInterest)}
Total Amount: ${formatCurrency(data.totalAmount)}
Start Date: ${format(new Date(data.startDate), "MMM dd, yyyy")}
Last Payment: ${format(new Date(data.lastPaymentDate), "MMM dd, yyyy")}`;
    
    const blob = new Blob([summaryText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    link.href = url;
    link.download = "loan_summary.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Summary Downloaded",
      description: "Loan summary has been downloaded successfully."
    });
  };

  if (!isClient) return null;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="col-span-2 shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <ChartPie className="h-5 w-5 mr-2" />
            <span>Loan Summary</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <SummaryCard
              title="EMI"
              value={formatCurrency(data.emi)}
              description="Monthly payment"
              icon="💸"
              color="bg-blue-100 dark:bg-blue-900/20"
              textColor="text-blue-600 dark:text-blue-400"
            />
            
            <SummaryCard
              title="Loan Amount"
              value={formatCurrency(data.loanAmount)}
              description="Principal amount"
              icon="💰"
              color="bg-green-100 dark:bg-green-900/20"
              textColor="text-green-600 dark:text-green-400"
            />
            
            <SummaryCard
              title="Interest"
              value={formatCurrency(data.totalInterest)}
              description="Total interest payable"
              icon="📈"
              color="bg-red-100 dark:bg-red-900/20"
              textColor="text-red-600 dark:text-red-400"
            />
            
            <SummaryCard
              title="Total Amount"
              value={formatCurrency(data.totalAmount)}
              description="Principal + Interest"
              icon="🏦"
              color="bg-amber-100 dark:bg-amber-900/20"
              textColor="text-amber-600 dark:text-amber-400"
            />
            
            <SummaryCard
              title="Prepayment"
              value={formatCurrency(data.totalPrepayment)}
              description="Total prepaid amount"
              icon="⚡"
              color="bg-emerald-100 dark:bg-emerald-900/20"
              textColor="text-emerald-600 dark:text-emerald-400"
            />
            
            <SummaryCard
              title="Last Payment"
              value={format(new Date(data.lastPaymentDate), "MMM yyyy")}
              description="Final payment date"
              icon="🗓️"
              color="bg-purple-100 dark:bg-purple-900/20"
              textColor="text-purple-600 dark:text-purple-400"
            />
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Loan Details</h3>
              <div className="space-y-2">
                <DetailRow 
                  label="Principal Amount" 
                  value={formatCurrency(data.loanAmount)}
                />
                <DetailRow 
                  label="Interest Rate" 
                  value={`${data.interestRate}% per annum`} 
                  tooltip="Annual interest rate applied to the loan"
                />
                <DetailRow 
                  label="Loan Tenure" 
                  value={`${data.loanTenure} years (${data.loanTenure * 12} months)`}
                />
                <DetailRow 
                  label="Start Date" 
                  value={format(new Date(data.startDate), "MMM dd, yyyy")}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Payment Summary</h3>
              <div className="space-y-2">
                <DetailRow 
                  label="Monthly EMI" 
                  value={formatCurrency(data.emi)}
                  tooltip="Equated Monthly Installment"
                />
                <DetailRow 
                  label="Total Interest Payable" 
                  value={formatCurrency(data.totalInterest)}
                />
                <DetailRow 
                  label="Total Payment" 
                  value={formatCurrency(data.totalAmount)}
                  tooltip="Principal + Interest"
                />
                <DetailRow 
                  label="Interest to Principal Ratio" 
                  value={`${((data.totalInterest / data.loanAmount) * 100).toFixed(2)}%`}
                  tooltip="Ratio of total interest to principal amount"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface SummaryCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: string;
  color: string;
  textColor: string;
}

const SummaryCard = ({ title, value, description, icon, color, textColor }: SummaryCardProps) => (
  <div className={`rounded-xl p-4 flex flex-col items-center transition-all duration-300 hover:scale-105 ${color}`}>
    <span className="text-2xl mb-2">{icon}</span>
    <h3 className="font-semibold text-center">{title}</h3>
    <p className={`text-lg font-bold ${textColor}`}>{value}</p>
    <p className="text-xs text-center text-muted-foreground mt-1">{description}</p>
  </div>
);

interface DetailRowProps {
  label: string;
  value: string | number;
  tooltip?: string;
}

const DetailRow = ({ label, value, tooltip }: DetailRowProps) => (
  <div className="flex justify-between items-center py-1.5 border-b border-border">
    <div className="flex items-center gap-1">
      <span>{label}</span>
      {tooltip && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <CircleInfo className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
    <span className="font-medium">{value}</span>
  </div>
);

export default LoanSummary;
