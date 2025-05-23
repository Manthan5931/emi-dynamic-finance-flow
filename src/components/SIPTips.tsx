
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const SIPTips = () => {
  const tips = [
    "Start early to benefit from the power of compounding over a longer period",
    "Increase your SIP amount periodically as your income grows",
    "Don't stop your SIPs during market downturns; they help in rupee cost averaging",
    "Consider tax-saving mutual funds (ELSS) for SIPs with a lock-in period of just 3 years",
    "Diversify your SIP investments across different fund categories to reduce risk"
  ];

  return (
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden border-t-4 border-t-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <CheckCircle2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold">Tips for SIP Investors</h2>
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

export default SIPTips;
