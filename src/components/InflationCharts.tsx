
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

interface InflationChartsProps {
  results: {
    currentAmount: number;
    futureValue: number;
    inflationRate: number;
    timePeriod: number;
    purchasingPowerLoss: number;
  };
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const InflationCharts = ({ results }: InflationChartsProps) => {
  const { currentAmount, futureValue, inflationRate, timePeriod, purchasingPowerLoss } = results;
  
  // Data for pie chart
  const pieData = [
    { name: "Current Value", value: currentAmount },
    { name: "Inflation Impact", value: purchasingPowerLoss }
  ];
  
  const COLORS = ["#3b82f6", "#ef4444"];
  
  // Data for line chart (yearly progression)
  const yearlyData = Array.from({ length: timePeriod + 1 }, (_, index) => {
    const year = index;
    const inflatedValue = currentAmount * Math.pow(1 + inflationRate / 100, year);
    return {
      year,
      currentValue: currentAmount,
      inflatedValue: inflatedValue,
      difference: inflatedValue - currentAmount
    };
  });
  
  // Data for bar chart
  const comparisonData = [
    {
      category: "Today",
      value: currentAmount,
      type: "current"
    },
    {
      category: `After ${timePeriod} years`,
      value: futureValue,
      type: "future"
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
          <CardTitle>Value Breakdown</CardTitle>
          <CardDescription>
            Current value vs inflation impact
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
          <CardTitle>Inflation Impact Over Time</CardTitle>
          <CardDescription>
            How inflation affects your money over the years
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
                  dataKey="currentValue" 
                  name="Current Value" 
                  stroke="#3b82f6" 
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
                <Line 
                  type="monotone" 
                  dataKey="inflatedValue" 
                  name="Required Value" 
                  stroke="#ef4444" 
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

export default InflationCharts;
