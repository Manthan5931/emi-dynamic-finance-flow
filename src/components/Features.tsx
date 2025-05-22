
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, Calendar, CreditCard, ActivitySquare } from "lucide-react";

const Features = () => {
  return (
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden border-t-4 border-t-blue-500">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Why Use Our EMI Calculator?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FeatureCard 
            icon={<BarChart3 className="h-5 w-5" />}
            title="Make Informed Borrowing Decisions" 
            description="Before taking a loan, use our calculator to determine whether the EMI fits comfortably within your monthly budget. This helps prevent financial strain and potential default issues." 
            color="bg-blue-100 dark:bg-blue-900/20"
            textColor="text-blue-600 dark:text-blue-400"
          />
          
          <FeatureCard 
            icon={<Calendar className="h-5 w-5" />}
            title="Plan for Financial Milestones" 
            description="See how different prepayment strategies can help you become debt-free sooner. Our calculator shows exactly how much you'll save in interest by making occasional lump-sum payments or increasing your regular EMI." 
            color="bg-amber-100 dark:bg-amber-900/20"
            textColor="text-amber-600 dark:text-amber-400"
          />
          
          <FeatureCard 
            icon={<ActivitySquare className="h-5 w-5" />}
            title="Prepare for Rate Fluctuations" 
            description="If you're considering a floating rate loan, our advanced options help you simulate the impact of potential interest rate changes, allowing you to prepare for varying EMIs." 
            color="bg-purple-100 dark:bg-purple-900/20"
            textColor="text-purple-600 dark:text-purple-400"
          />
          
          <FeatureCard 
            icon={<CreditCard className="h-5 w-5" />}
            title="Compare Loan Offers" 
            description="Received multiple loan offers? Use our calculator to compare them side by side, considering different interest rates, tenures, and processing fees to identify the most cost-effective option." 
            color="bg-green-100 dark:bg-green-900/20"
            textColor="text-green-600 dark:text-green-400"
          />
        </div>
      </div>
    </Card>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  textColor: string;
}

const FeatureCard = ({ icon, title, description, color, textColor }: FeatureCardProps) => {
  return (
    <div className="flex gap-4">
      <div className={`${color} ${textColor} p-3 h-fit rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
    </div>
  );
};

export default Features;
