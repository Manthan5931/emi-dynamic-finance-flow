
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar, ChartLine, CircleIcon, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer, TooltipProps } from 'recharts';
import { formatCurrency } from "@/lib/emi-calculator";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";

interface LoanChartsProps {
  data: any;
}

const LoanCharts = ({ data }: LoanChartsProps) => {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  // Prepare data for pie chart
  const pieChartData = [
    { name: 'Principal', value: data.loanAmount },
    { name: 'Interest', value: data.totalInterest },
    { name: 'Prepayment', value: data.totalPrepayment }
  ];
  
  // Filter out zero values
  const filteredPieData = pieChartData.filter(item => item.value > 0);
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#FF8042', '#00C49F'];
  
  // Prepare data for bar chart (yearly amortization)
  const prepareYearlyData = () => {
    const yearlyData: any[] = [];
    const yearMap = new Map();
    
    // Group by year
    data.schedule.forEach((item: any) => {
      const year = item.date.split(' ')[1]; // Extract year from "MMM YYYY"
      if (!yearMap.has(year)) {
        yearMap.set(year, {
          year,
          principal: 0,
          interest: 0
        });
      }
      
      const yearData = yearMap.get(year);
      yearData.principal += item.principalPayment;
      yearData.interest += item.interestPayment;
    });
    
    // Convert map to array
    yearMap.forEach((value, key) => {
      yearlyData.push(value);
    });
    
    return yearlyData;
  };
  
  // Prepare data for balance over time chart
  const prepareBalanceData = () => {
    return data.schedule.filter((_: any, index: number) => index % 6 === 0 || index === data.schedule.length - 1).map((item: any, index: number) => ({
      month: index,
      remainingBalance: item.balance,
      principalPaid: item.principalPaid
    }));
  };
  
  const yearlyData = prepareYearlyData();
  const balanceData = prepareBalanceData();
  
  // Custom tooltip for the charts
  const CustomTooltip = ({ active, payload, label, formatter }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border p-3 rounded-md shadow-lg">
          <p className="font-medium mb-1">{`Month ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Loan Charts",
        text: `Check out my loan charts: Principal: ${formatCurrency(data.loanAmount)}, Interest: ${formatCurrency(data.totalInterest)}`,
      })
      .then(() => {
        toast({
          title: "Shared Successfully",
          description: "Charts have been shared."
        });
      })
      .catch(() => {
        toast({
          title: "Share Cancelled",
          description: "Share operation was cancelled."
        });
      });
    } else {
      toast({
        title: "Share Not Supported",
        description: "Web Share API is not supported in your browser.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="grid gap-6">
      {/* Payment Breakdown */}
      <Card className="shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <ChartBar className="h-5 w-5 mr-2" />
            <span>Payment Breakdown</span>
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleShare}>
              <Share className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-4 text-blue-500">Payment Breakdown</h3>
              <div className="h-[300px] w-full">
                {filteredPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={filteredPieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        innerRadius={60}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {filteredPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => formatCurrency(value)}
                      />
                      <Legend 
                        align="center" 
                        verticalAlign="bottom" 
                        layout="horizontal" 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No data available for chart</p>
                  </div>
                )}
              </div>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Total Amount: {formatCurrency(data.totalAmount)}
              </p>
            </div>
            
            {/* Yearly Amortization Bar Chart */}
            <div className="flex flex-col items-center">
              <h3 className="text-sm font-medium mb-4 text-purple-500">Yearly Amortization</h3>
              <div className="h-[300px] w-full">
                {yearlyData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={yearlyData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}K`} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="principal" name="Principal Paid" fill="#0088FE" stackId="a" />
                      <Bar dataKey="interest" name="Interest Paid" fill="#FF8042" stackId="a" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No data available for chart</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Loan Balance Over Time */}
      <Card className="shadow-lg transition-all duration-300 hover:shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChartLine className="h-5 w-5 mr-2" />
            <span>Loan Balance Over Time</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={balanceData}
                margin={{ top: 10, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="remainingBalance"
                  name="Remaining Balance"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="principalPaid"
                  name="Principal Paid"
                  stroke="#00C49F"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoanCharts;
