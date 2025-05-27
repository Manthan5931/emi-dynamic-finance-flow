
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import CalculatorNavigation from "@/components/CalculatorNavigation";
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
  TrendingDown,
  ArrowRight,
  IndianRupee,
  BarChart3,
  Zap
} from "lucide-react";

const calculatorCategories = [
  {
    title: "Investment Calculators",
    description: "Plan your investments and watch your money grow",
    items: [
      { title: "SIP Calculator", href: "/sip-calculator", icon: TrendingUp, description: "Systematic Investment Plan returns calculation", color: "bg-blue-500" },
      { title: "Lumpsum Calculator", href: "/lumpsum-calculator", icon: PiggyBank, description: "One-time investment growth projection", color: "bg-green-500" },
      { title: "PPF Calculator", href: "/ppf-calculator", icon: Shield, description: "Public Provident Fund returns over 15 years", color: "bg-emerald-500" },
      { title: "NPS Calculator", href: "/nps-calculator", icon: Award, description: "National Pension Scheme benefits calculation", color: "bg-yellow-500" },
    ]
  },
  {
    title: "Deposit Calculators",
    description: "Calculate returns on your safe investments",
    items: [
      { title: "FD Calculator", href: "/fd-calculator", icon: Landmark, description: "Fixed Deposit maturity amount calculation", color: "bg-purple-500" },
      { title: "RD Calculator", href: "/rd-calculator", icon: Banknote, description: "Recurring Deposit monthly savings returns", color: "bg-blue-600" },
    ]
  },
  {
    title: "Planning Calculators",
    description: "Plan your financial future and optimize taxes",
    items: [
      { title: "EMI Calculator", href: "/", icon: Calculator, description: "Loan EMI and payment schedule calculation", color: "bg-indigo-500" },
      { title: "Retirement Calculator", href: "/retirement-calculator", icon: Target, description: "Build your retirement corpus strategically", color: "bg-purple-600" },
      { title: "Income Tax Calculator", href: "/income-tax-calculator", icon: Receipt, description: "Calculate tax liability and optimize savings", color: "bg-red-500" },
      { title: "Inflation Calculator", href: "/inflation-calculator", icon: TrendingDown, description: "Future purchasing power analysis", color: "bg-orange-500" },
    ]
  }
];

const financialTips = [
  {
    title: "Start Early",
    description: "The power of compounding works best when you start investing early. Even small amounts can grow significantly over time.",
    icon: Zap
  },
  {
    title: "Diversify Your Portfolio",
    description: "Don't put all your eggs in one basket. Spread your investments across different asset classes to reduce risk.",
    icon: BarChart3
  },
  {
    title: "Emergency Fund",
    description: "Maintain 6-12 months of expenses as an emergency fund before making long-term investments.",
    icon: Shield
  },
  {
    title: "Tax Planning",
    description: "Use tax-saving instruments like ELSS, PPF, and NPS to reduce your tax liability while building wealth.",
    icon: Receipt
  }
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 p-4 border-b bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm">
          <CalculatorNavigation />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Financial Calculator Suite
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Make informed financial decisions with our comprehensive collection of calculators. 
            Plan your investments, calculate EMIs, and optimize your financial future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Calculator className="mr-2 h-5 w-5" />
                Start Calculating
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Calculator Categories */}
        <div className="space-y-12 mb-16">
          {calculatorCategories.map((category, categoryIndex) => (
            <div key={category.title}>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">{category.title}</h2>
                <p className="text-muted-foreground">{category.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.items.map((item) => (
                  <Link key={item.href} to={item.href}>
                    <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                      <CardHeader className="pb-3">
                        <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center mb-3`}>
                          <item.icon className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{item.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Financial Tips Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 rounded-lg p-8 backdrop-blur-sm mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Smart Financial Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialTips.map((tip, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <tip.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Calculators?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div>
              <IndianRupee className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Accurate Calculations</h3>
              <p className="text-blue-100">Precise mathematical formulas ensure reliable results for your financial planning</p>
            </div>
            <div>
              <Shield className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Secure & Private</h3>
              <p className="text-blue-100">All calculations are performed locally in your browser. Your data never leaves your device</p>
            </div>
            <div>
              <Zap className="h-12 w-12 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Instant Results</h3>
              <p className="text-blue-100">Get immediate calculations with detailed breakdowns and visual charts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
