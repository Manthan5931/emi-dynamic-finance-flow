
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
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden border-t-4 border-t-orange-500">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg">
            <CheckCircle2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
          </div>
          <h2 className="text-2xl font-bold">Tips for Loan Management</h2>
        </div>
        
        <ul className="space-y-3">
          {tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default LoanTips;
