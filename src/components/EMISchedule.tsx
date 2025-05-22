
import { useState } from "react";
import { CalendarPlus, ChevronDown, ChevronUp, Download, Share } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatPercentage } from "@/lib/emi-calculator";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface EMIScheduleProps {
  data: any;
}

const EMISchedule = ({ data }: EMIScheduleProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedYears, setExpandedYears] = useState<Record<string, boolean>>({});
  
  // Group schedule by years
  const groupByYear = () => {
    const yearlyData: Record<string, any[]> = {};
    
    data.schedule.forEach((item: any) => {
      const year = item.date.split(' ')[1]; // Extract year from "MMM YYYY"
      
      if (!yearlyData[year]) {
        yearlyData[year] = [];
      }
      
      yearlyData[year].push(item);
    });
    
    return yearlyData;
  };
  
  const yearlyData = groupByYear();
  const years = Object.keys(yearlyData).sort();
  
  // Calculate yearly totals
  const calculateYearlyTotals = (items: any[]) => {
    return items.reduce((acc, item) => {
      return {
        emi: acc.emi + item.emi,
        interestPayment: acc.interestPayment + item.interestPayment,
        principalPayment: acc.principalPayment + item.principalPayment,
        prepayment: acc.prepayment + (item.prepayment || 0),
        totalPayment: acc.totalPayment + item.totalPayment,
      };
    }, { 
      emi: 0, 
      interestPayment: 0, 
      principalPayment: 0, 
      prepayment: 0, 
      totalPayment: 0 
    });
  };
  
  // Filter schedule based on search term
  const filterSchedule = () => {
    if (!searchTerm) return yearlyData;
    
    const filteredData: Record<string, any[]> = {};
    
    years.forEach(year => {
      const filteredItems = yearlyData[year].filter((item: any) => 
        item.date.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (filteredItems.length > 0) {
        filteredData[year] = filteredItems;
      }
    });
    
    return filteredData;
  };
  
  const filteredSchedule = filterSchedule();
  const filteredYears = Object.keys(filteredSchedule).sort();
  
  const toggleYear = (year: string) => {
    setExpandedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }));
  };
  
  const handleDownload = () => {
    let csvContent = "Month,Date,EMI Amount,Principal,Interest,Balance\n";
    
    data.schedule.forEach((item: any) => {
      csvContent += `${item.month},${item.date},${item.emi},${item.principalPayment},${item.interestPayment},${item.balance}\n`;
    });
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    
    link.setAttribute("href", url);
    link.setAttribute("download", "emi_schedule.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Schedule Downloaded",
      description: "EMI schedule has been downloaded successfully."
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "EMI Schedule",
        text: "Check out my loan EMI schedule",
      })
      .then(() => {
        toast({
          title: "Shared Successfully",
          description: "EMI schedule has been shared."
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
    <Card className="overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl">
      <CardHeader className="bg-background border-b flex flex-row items-center justify-between py-4">
        <CardTitle className="flex items-center">
          <CalendarPlus className="h-5 w-5 mr-2" />
          <span>EMI Schedule</span>
        </CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="h-8">
            <Share className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="h-8">
            <Download className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="p-4">
          <Input 
            type="text" 
            placeholder="Search by month/year..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50 sticky top-0 z-10">
              <TableRow>
                <TableHead className="w-[80px]">Month</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">EMI</TableHead>
                <TableHead className="text-right">Principal</TableHead>
                <TableHead className="text-right">Interest</TableHead>
                {data.schedule.some((item: any) => item.prepayment > 0) && (
                  <TableHead className="text-right">Prepayment</TableHead>
                )}
                <TableHead className="text-right">Total Payment</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredYears.length > 0 ? (
                filteredYears.map(year => {
                  const yearItems = filteredSchedule[year];
                  const yearlyTotals = calculateYearlyTotals(yearItems);
                  
                  return (
                    <Collapsible 
                      key={year}
                      open={expandedYears[year]}
                      onOpenChange={() => toggleYear(year)}
                      className="w-full"
                    >
                      <CollapsibleTrigger asChild>
                        <TableRow className="bg-muted/20 hover:bg-muted/30 cursor-pointer font-medium">
                          <TableCell colSpan={2} className="flex items-center">
                            {expandedYears[year] ? 
                              <ChevronUp className="h-4 w-4 mr-2" /> : 
                              <ChevronDown className="h-4 w-4 mr-2" />
                            }
                            {year}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(yearlyTotals.emi)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(yearlyTotals.principalPayment)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(yearlyTotals.interestPayment)}</TableCell>
                          {data.schedule.some((item: any) => item.prepayment > 0) && (
                            <TableCell className="text-right">{formatCurrency(yearlyTotals.prepayment)}</TableCell>
                          )}
                          <TableCell className="text-right">{formatCurrency(yearlyTotals.totalPayment)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(yearItems[yearItems.length - 1].balance)}
                          </TableCell>
                        </TableRow>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        {yearItems.map((item: any, index: number) => (
                          <TableRow key={`${year}-${index}`} className={index % 2 === 0 ? "bg-background" : "bg-muted/10"}>
                            <TableCell className="pl-9">{item.month}</TableCell>
                            <TableCell>{item.date}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.emi)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.principalPayment)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.interestPayment)}</TableCell>
                            {data.schedule.some((item: any) => item.prepayment > 0) && (
                              <TableCell className="text-right">{formatCurrency(item.prepayment)}</TableCell>
                            )}
                            <TableCell className="text-right">{formatCurrency(item.totalPayment)}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.balance)}</TableCell>
                          </TableRow>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-4">No results found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default EMISchedule;
