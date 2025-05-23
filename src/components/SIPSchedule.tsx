
import React, { useState } from "react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SIPScheduleProps {
  schedule: Array<{
    month: number;
    date: Date;
    investment: number;
    totalInvestment: number;
    interestEarned: number;
    totalValue: number;
  }>;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const SIPSchedule = ({ schedule }: SIPScheduleProps) => {
  const [expandedYears, setExpandedYears] = useState<number[]>([1]);

  // Group schedule by year
  const scheduleByYear = schedule.reduce((acc, month) => {
    const year = Math.ceil(month.month / 12);
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(month);
    return acc;
  }, {} as Record<number, typeof schedule>);

  const toggleYear = (year: number) => {
    if (expandedYears.includes(year)) {
      setExpandedYears(expandedYears.filter(y => y !== year));
    } else {
      setExpandedYears([...expandedYears, year]);
    }
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
        <CardTitle className="text-xl">SIP Investment Schedule</CardTitle>
        <CardDescription>
          Yearly breakdown of your SIP investments over time
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="max-h-[500px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[150px]">Period</TableHead>
                <TableHead>Invested</TableHead>
                <TableHead>Interest Earned</TableHead>
                <TableHead>Total Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(scheduleByYear).map(([yearStr, months]) => {
                const year = parseInt(yearStr);
                const lastMonth = months[months.length - 1];
                const isExpanded = expandedYears.includes(year);

                return (
                  <React.Fragment key={`year-${year}`}>
                    <TableRow 
                      className="cursor-pointer hover:bg-muted/80 group"
                      onClick={() => toggleYear(year)}
                    >
                      <TableCell className="font-medium flex items-center gap-2">
                        {isExpanded ? 
                          <ChevronDown className="h-4 w-4 text-muted-foreground" /> : 
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        }
                        Year {year}
                      </TableCell>
                      <TableCell>{formatCurrency(lastMonth.totalInvestment)}</TableCell>
                      <TableCell className="text-green-600">{formatCurrency(lastMonth.interestEarned)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(lastMonth.totalValue)}</TableCell>
                    </TableRow>

                    {isExpanded && months.map(month => (
                      <TableRow key={`month-${month.month}`} className="bg-muted/30">
                        <TableCell className="pl-10">
                          Month {month.month} ({format(month.date, "MMM yyyy")})
                        </TableCell>
                        <TableCell>{formatCurrency(month.totalInvestment)}</TableCell>
                        <TableCell className="text-green-600">{formatCurrency(month.interestEarned)}</TableCell>
                        <TableCell>{formatCurrency(month.totalValue)}</TableCell>
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SIPSchedule;
