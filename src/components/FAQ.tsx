
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const FAQ = () => {
  return (
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden border-t-4 border-t-primary">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
            <HelpCircle className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border px-4 rounded-lg overflow-hidden border-l-[3px] border-l-blue-500">
            <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
              Is the EMI amount fixed throughout the loan tenure?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-muted-foreground">
              For fixed-rate loans, the EMI remains constant unless you opt for prepayments or restructuring. For floating-rate loans, the EMI may change when interest rates are reset, unless you adjust the tenure instead.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border px-4 rounded-lg overflow-hidden border-l-[3px] border-l-green-500">
            <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
              How do prepayments affect my loan?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-muted-foreground">
              Prepayments reduce your outstanding principal, which in turn decreases the interest component of future EMIs. This either shortens your loan tenure or reduces your EMI amount, depending on your agreement with the lender.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border px-4 rounded-lg overflow-hidden border-l-[3px] border-l-red-500">
            <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
              What happens if I miss an EMI payment?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-muted-foreground">
              Missing EMI payments typically incurs late payment fees and negatively impacts your credit score. Multiple missed payments may result in penalties and potentially lead to loan default procedures.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border px-4 rounded-lg overflow-hidden border-l-[3px] border-l-emerald-500">
            <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
              Can I increase my EMI amount later?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-muted-foreground">
              Yes, most lenders allow you to increase your EMI amount. This helps reduce your overall interest burden and shortens the loan tenure. Our advanced EMI change feature lets you model such scenarios.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default FAQ;
