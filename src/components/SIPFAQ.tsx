
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const SIPFAQ = () => {
  return (
    <Card className="shadow-lg transition-all duration-300 hover:shadow-xl overflow-hidden border-t-4 border-t-primary bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/10">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        </div>
        
        <Accordion type="single" collapsible className="w-full space-y-4">
          <AccordionItem value="item-1" className="border px-4 rounded-lg overflow-hidden border-l-[3px] border-l-blue-500 shadow-sm bg-background/80">
            <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
              What is a SIP and how does it work?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-muted-foreground">
              A Systematic Investment Plan (SIP) is an investment method that allows you to invest a fixed amount regularly (usually monthly) in mutual funds. It helps you build wealth over time through disciplined investing and rupee-cost averaging, where you automatically buy more units when prices are low and fewer when prices are high.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border px-4 rounded-lg overflow-hidden border-l-[3px] border-l-green-500 shadow-sm bg-background/80">
            <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
              What is the minimum amount required for SIP?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-muted-foreground">
              Most mutual funds allow you to start a SIP with as little as ₹500 per month, though this can vary depending on the fund. Some funds may have higher minimums like ₹1,000 or ₹5,000 per month for certain schemes.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border px-4 rounded-lg overflow-hidden border-l-[3px] border-l-purple-500 shadow-sm bg-background/80">
            <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
              Is SIP better than a lump sum investment?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-muted-foreground">
              SIPs are generally better for regular investors as they offer the benefit of rupee-cost averaging and help reduce the impact of market volatility. Lump sum investments might work better when you're confident that markets are at a low point. For most retail investors, SIPs provide a more disciplined and less stressful approach to long-term wealth creation.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border px-4 rounded-lg overflow-hidden border-l-[3px] border-l-amber-500 shadow-sm bg-background/80">
            <AccordionTrigger className="text-lg font-medium py-4 hover:no-underline">
              Can I change my SIP amount or stop it temporarily?
            </AccordionTrigger>
            <AccordionContent className="pb-4 text-muted-foreground">
              Yes, most fund houses allow you to modify your SIP amount, pause it temporarily, or discontinue it. You'll need to submit a request to your fund house or do it through their online portal. The flexibility varies between different fund houses and plans. Some may require notice of 15-30 days before changes take effect.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Card>
  );
};

export default SIPFAQ;
