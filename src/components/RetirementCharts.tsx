
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

interface RetirementChartsProps {
  results: {
    currentAge: number;
    retirementAge: number;
    yearsToRetirement: number;
    currentMonthlyExpenses: number;
    futureMonthlyExpenses: number;
    corpusNeeded: number;
    monthlySIPNeeded: number;
    expectedReturn: number;
    inflationRate: number;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const RetirementCharts = ({ results }: RetirementChartsProps) => {
  const { 
    yearsToRetirement, 
    monthlySIPNeeded, 
    corpusNeeded, 
    expectedReturn,
    currentMonthlyExpenses,
    futureMonthlyExpenses 
  } = results;
  
  const totalInvestment = monthlySIPNeeded * 12 * yearsToRetirement;
  const totalReturns = corpusNeeded - totalInvestment;
  
  // Data for pie chart
  const pieData = [
    { name: "Total Investment", value: totalInvestment },
    { name: "Returns Generated", value: totalReturns }
  ];
  
  const COLORS = ["#3b82f6", "#10b981"];
  
  // Data for line chart (SIP growth over time)
  const monthlyReturn = expectedReturn / 12 / 100;
  const yearlyData = Array.from({ length: yearsToRetirement + 1 }, (_, index) => {
    const year = index;
    const months = year * 12;
    const totalInvested = monthlySIPNeeded * months;
    
    let sipValue = 0;
    if (months > 0) {
      sipValue = monthlySIPNeeded * ((Math.pow(1 + monthlyReturn, months) - 1) / monthlyReturn);
    }
    
    return {
      year,
      totalInvested,
      sipValue,
      returns: sipValue - totalInvested
    };
  });
  
  // Data for expense comparison
  const expenseData = [
    {
      category: "Current Expenses",
      monthly: currentMonthlyExpenses,
      annual: currentMonthlyExpenses * 12
    },
    {
      category: "Future Expenses",
      monthly: futureMonthlyExpenses,
      annual: futureMonthlyExpenses * 12
    }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-md">
          <p className="font-medium">{`Year ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <Card className="shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle>Retirement Corpus Breakdown</CardTitle>
          <CardDescription>
            Investment vs Returns Distribution
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle>SIP Growth Projection</CardTitle>
          <CardDescription>
            How your monthly SIP grows over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={yearlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="year" 
                  label={{ value: 'Year', position: 'insideBottom', offset: -10 }} 
                />
                <YAxis 
                  tickFormatter={(value) => {
                    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
                    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
                    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
                    return `₹${value}`;
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalInvested" 
                  name="Total Investment" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                />
                <Line 
                  type="monotone" 
                  dataKey="sipValue" 
                  name="Portfolio Value" 
                  stroke="#10b981" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2 shadow-md hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <CardTitle>Expense Inflation Impact</CardTitle>
          <CardDescription>
            Current vs Future Monthly Expenses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={expenseData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="category" />
                <YAxis 
                  tickFormatter={(value) => {
                    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
                    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
                    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
                    return `₹${value}`;
                  }}
                />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Legend />
                <Bar dataKey="monthly" fill="#8884d8" name="Monthly" />
                <Bar dataKey="annual" fill="#82ca9d" name="Annual" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetirementCharts;
