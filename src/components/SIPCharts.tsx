
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

interface SIPChartsProps {
  results: {
    totalInvestment: number;
    totalReturns: number;
    schedule: Array<{
      month: number;
      totalInvestment: number;
      interestEarned: number;
      totalValue: number;
    }>;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const SIPCharts = ({ results }: SIPChartsProps) => {
  const { totalInvestment, totalReturns, schedule } = results;
  
  // Data for pie chart
  const pieData = [
    { name: "Amount Invested", value: totalInvestment },
    { name: "Returns", value: totalReturns }
  ];
  
  const COLORS = ["#3b82f6", "#10b981"];
  
  // Data for line chart (yearly growth)
  const yearlyData = schedule.filter(item => item.month % 12 === 0 || item.month === schedule.length)
    .map(item => ({
      year: Math.ceil(item.month / 12),
      investment: item.totalInvestment,
      returns: item.interestEarned,
      totalValue: item.totalValue
    }));
  
  // Custom tooltip for charts
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
          <CardTitle>Investment Breakdown</CardTitle>
          <CardDescription>
            Distribution between principal and returns
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
          <CardTitle>Investment Growth</CardTitle>
          <CardDescription>
            Year-by-year growth of your SIP investment
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
                  dataKey="investment" 
                  name="Investment" 
                  stroke="#3b82f6" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2} 
                />
                <Line 
                  type="monotone" 
                  dataKey="totalValue" 
                  name="Total Value" 
                  stroke="#10b981" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SIPCharts;
