
import { useState } from "react";
import { CalendarPlus, ChartBar, Download, Share } from "lucide-react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency, formatPercentage } from "@/lib/emi-calculator";
import { useToast } from "@/hooks/use-toast";

interface EMIScheduleProps {
  data: any;
}

const EMISchedule = ({ data }: EMIScheduleProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  
  // Filter schedule based on search term
  const filteredSchedule = data.schedule.filter((item: any) => 
    item.date.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calculate pagination values
  const totalPages = Math.ceil(filteredSchedule.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSchedule = filteredSchedule.slice(startIndex, startIndex + itemsPerPage);
  
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
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
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
            <TableCaption>
              <div className="flex justify-center items-center gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  Next
                </Button>
              </div>
            </TableCaption>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Month</TableHead>
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
              {paginatedSchedule.length > 0 ? (
                paginatedSchedule.map((item: any, index: number) => (
                  <TableRow key={index} className={index % 2 === 0 ? "bg-background" : "bg-muted/10"}>
                    <TableCell className="font-medium">{item.month}</TableCell>
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
                ))
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
