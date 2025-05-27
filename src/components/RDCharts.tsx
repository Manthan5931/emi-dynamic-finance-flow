
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
  AreaChart,
  Area,
} from "recharts";

interface RDChartsProps {
  results: {
    monthlyDeposit: number;
    interestRate: number;
    timePeriod: number;
    totalInvestment: number;
    maturityAmount: number;
    totalReturns: number;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const RDCharts = ({ results }: RDChartsProps) => {
  const { monthlyDeposit, interestRate, timePeriod, totalInvestment, maturityAmount, totalReturns } = results;
  
  // Data for pie chart
  const pieData = [
    { name: "Principal Amount", value: totalInvestment },
    { name: "Interest Earned", value: totalReturns }
  ];
  
  const COLORS = ["#3b82f6", "#10b981"];
  
  // Data for line chart (monthly growth)
  const monthlyRate = interestRate / (12 * 100);
  const totalMonths = timePeriod * 12;
  
  const monthlyData = Array.from({ length: totalMonths + 1 }, (_, index) => {
    const month = index;
    const totalDeposits = monthlyDeposit * month;
    let maturityValue = 0;
    
    if (month > 0) {
      maturityValue = monthlyDeposit * (((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * (1 + monthlyRate));
    }
    
    return {
      month,
      year: Math.ceil(month / 12),
      totalDeposits,
      maturityValue,
      interestEarned: maturityValue - totalDeposits
    };
  });

  // Filter for yearly data
  const yearlyData = monthlyData.filter(item => item.month % 12 === 0 || item.month === totalMonths);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 border rounded-md shadow-md">
          <p className="font-medium">{`Month ${label}`}</p>
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
            Principal vs Interest Distribution
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
          <CardTitle>Growth Over Time</CardTitle>
          <CardDescription>
            RD growth progression over the investment period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
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
                <Area
                  type="monotone"
                  dataKey="totalDeposits"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  name="Deposits"
                />
                <Area
                  type="monotone"
                  dataKey="interestEarned"
                  stackId="1"
                  stroke="#10b981"
                  fill="#10b981"
                  name="Interest"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RDCharts;
