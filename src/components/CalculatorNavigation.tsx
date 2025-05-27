
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  Calculator, 
  TrendingUp, 
  Landmark, 
  PiggyBank,
  Shield,
  Banknote,
  Target,
  Receipt,
  Award,
  TrendingDown
} from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

const calculatorCategories = [
  {
    title: "Investment Calculators",
    items: [
      { title: "SIP Calculator", href: "/sip-calculator", icon: TrendingUp, description: "Systematic Investment Plan returns" },
      { title: "Lumpsum Calculator", href: "/lumpsum-calculator", icon: PiggyBank, description: "One-time investment growth" },
      { title: "PPF Calculator", href: "/ppf-calculator", icon: Shield, description: "Public Provident Fund returns" },
      { title: "NPS Calculator", href: "/nps-calculator", icon: Award, description: "National Pension Scheme" },
    ]
  },
  {
    title: "Deposit Calculators",
    items: [
      { title: "FD Calculator", href: "/fd-calculator", icon: Landmark, description: "Fixed Deposit maturity amount" },
      { title: "RD Calculator", href: "/rd-calculator", icon: Banknote, description: "Recurring Deposit returns" },
    ]
  },
  {
    title: "Planning Calculators",
    items: [
      { title: "EMI Calculator", href: "/", icon: Calculator, description: "Loan EMI calculations" },
      { title: "Retirement Calculator", href: "/retirement-calculator", icon: Target, description: "Plan your retirement corpus" },
      { title: "Income Tax Calculator", href: "/income-tax-calculator", icon: Receipt, description: "Calculate your tax liability" },
      { title: "Inflation Calculator", href: "/inflation-calculator", icon: TrendingDown, description: "Future value with inflation" },
    ]
  }
];

const CalculatorNavigation = () => {
  const location = useLocation();

  return (
    <div className="flex items-center justify-between w-full">
      <Link to="/" className="flex items-center gap-2 font-bold text-xl">
        <Calculator className="h-6 w-6" />
        FinCalc
      </Link>
      
      <div className="hidden lg:flex items-center gap-4">
        <NavigationMenu>
          <NavigationMenuList>
            {calculatorCategories.map((category) => (
              <NavigationMenuItem key={category.title}>
                <NavigationMenuTrigger className="text-sm">
                  {category.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[400px] gap-3 p-4">
                    <div className="row-span-3">
                      <h4 className="mb-2 text-sm font-medium leading-none">
                        {category.title}
                      </h4>
                      <div className="grid gap-2">
                        {category.items.map((item) => (
                          <NavigationMenuLink key={item.href} asChild>
                            <Link
                              to={item.href}
                              className={cn(
                                "flex items-start gap-3 rounded-md p-3 text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                                location.pathname === item.href && "bg-accent text-accent-foreground"
                              )}
                            >
                              <item.icon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                              <div>
                                <div className="font-medium">{item.title}</div>
                                <div className="text-xs text-muted-foreground">{item.description}</div>
                              </div>
                            </Link>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
        <ThemeToggle />
      </div>

      {/* Mobile navigation - simplified for now */}
      <div className="lg:hidden flex items-center gap-2">
        <ThemeToggle />
      </div>
    </div>
  );
};

export default CalculatorNavigation;
