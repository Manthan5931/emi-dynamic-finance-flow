
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const LoanTips = () => {
  const tips = [
    "Allocate no more than 40-50% of your monthly income towards total debt repayments",
    "Consider prepayments whenever you receive bonuses or unexpected windfalls",
    "Review your loan terms periodically to check if refinancing at lower rates makes sense",
    "Set up automatic payments to avoid late payment penalties",
    "Maintain an emergency fund of 3-6 months' expenses to ensure you never miss EMI payments"
  ];

  return (
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden border-t-4 border-t-orange-500 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/10">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
            <CheckCircle2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold">Tips for Loan Management</h2>
        </div>
        
        <ul className="space-y-4">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-3 group">
              <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full mt-0.5 group-hover:bg-green-200 dark:group-hover:bg-green-800/30 transition-colors duration-200">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <span className="text-muted-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default LoanTips;
