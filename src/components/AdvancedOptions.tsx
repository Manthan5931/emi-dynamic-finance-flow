
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AdvancedOptionsProps {
  onPrepaymentUpdate: (prepayments: any[]) => void;
  onRateChangeUpdate: (rateChanges: any[]) => void;
  onEmiChangeUpdate: (emiChanges: any[]) => void;
}

const AdvancedOptions = ({ 
  onPrepaymentUpdate, 
  onRateChangeUpdate,
  onEmiChangeUpdate 
}: AdvancedOptionsProps) => {
  const [prepayments, setPrepayments] = useState<any[]>([]);
  const [rateChanges, setRateChanges] = useState<any[]>([]);
  const [emiChanges, setEmiChanges] = useState<any[]>([]);
  
  // Prepayment state
  const [prepaymentAmount, setPrepaymentAmount] = useState<number>(0);
  const [prepaymentDate, setPrepaymentDate] = useState<Date | undefined>(undefined);
  const [prepaymentOption, setPrepaymentOption] = useState<string>("reduce-tenure");
  
  // Rate change state
  const [newRate, setNewRate] = useState<number>(0);
  const [rateChangeDate, setRateChangeDate] = useState<Date | undefined>(undefined);
  
  // EMI change state
  const [newEmi, setNewEmi] = useState<number>(0);
  const [emiChangeDate, setEmiChangeDate] = useState<Date | undefined>(undefined);
  
  // Dialog state
  const [prepaymentDialogOpen, setPrepaymentDialogOpen] = useState(false);
  const [rateChangeDialogOpen, setRateChangeDialogOpen] = useState(false);
  const [emiChangeDialogOpen, setEmiChangeDialogOpen] = useState(false);

  // Add a prepayment
  const handleAddPrepayment = () => {
    if (prepaymentAmount > 0 && prepaymentDate) {
      const newPrepayment = {
        amount: prepaymentAmount,
        date: prepaymentDate,
        option: prepaymentOption
      };
      
      const updatedPrepayments = [...prepayments, newPrepayment];
      setPrepayments(updatedPrepayments);
      onPrepaymentUpdate(updatedPrepayments);
      
      // Reset fields
      setPrepaymentAmount(0);
      setPrepaymentDate(undefined);
      setPrepaymentDialogOpen(false);
    }
  };
  
  // Add a rate change
  const handleAddRateChange = () => {
    if (newRate > 0 && rateChangeDate) {
      const rateChange = {
        newRate,
        date: rateChangeDate
      };
      
      const updatedRateChanges = [...rateChanges, rateChange];
      setRateChanges(updatedRateChanges);
      onRateChangeUpdate(updatedRateChanges);
      
      // Reset fields
      setNewRate(0);
      setRateChangeDate(undefined);
      setRateChangeDialogOpen(false);
    }
  };
  
  // Add an EMI change
  const handleAddEmiChange = () => {
    if (newEmi > 0 && emiChangeDate) {
      const emiChange = {
        newEmi,
        date: emiChangeDate
      };
      
      const updatedEmiChanges = [...emiChanges, emiChange];
      setEmiChanges(updatedEmiChanges);
      onEmiChangeUpdate(updatedEmiChanges);
      
      // Reset fields
      setNewEmi(0);
      setEmiChangeDate(undefined);
      setEmiChangeDialogOpen(false);
    }
  };
  
  // Remove a prepayment
  const removePrepayment = (index: number) => {
    const updatedPrepayments = prepayments.filter((_, i) => i !== index);
    setPrepayments(updatedPrepayments);
    onPrepaymentUpdate(updatedPrepayments);
  };
  
  // Remove a rate change
  const removeRateChange = (index: number) => {
    const updatedRateChanges = rateChanges.filter((_, i) => i !== index);
    setRateChanges(updatedRateChanges);
    onRateChangeUpdate(updatedRateChanges);
  };
  
  // Remove an EMI change
  const removeEmiChange = (index: number) => {
    const updatedEmiChanges = emiChanges.filter((_, i) => i !== index);
    setEmiChanges(updatedEmiChanges);
    onEmiChangeUpdate(updatedEmiChanges);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 border rounded-lg p-4">
        {/* Prepayment section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-emerald-500">
              <span className="font-semibold">Prepayment</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Add one-time or recurring prepayments to reduce your loan burden</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Dialog open={prepaymentDialogOpen} onOpenChange={setPrepaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-dashed border-emerald-500 text-emerald-500">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Prepayment</DialogTitle>
                  <DialogDescription>
                    Enter prepayment details to reduce your loan burden
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="prepayment-amount">Prepayment Amount (₹)</Label>
                    <Input
                      id="prepayment-amount"
                      type="number"
                      value={prepaymentAmount || ""}
                      onChange={(e) => setPrepaymentAmount(Number(e.target.value))}
                      placeholder="Enter amount"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Prepayment Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !prepaymentDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {prepaymentDate ? format(prepaymentDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={prepaymentDate}
                          onSelect={setPrepaymentDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Prepayment Option</Label>
                    <RadioGroup 
                      defaultValue="reduce-tenure"
                      value={prepaymentOption}
                      onValueChange={setPrepaymentOption}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reduce-tenure" id="reduce-tenure" />
                        <Label htmlFor="reduce-tenure">Reduce loan tenure</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="reduce-emi" id="reduce-emi" />
                        <Label htmlFor="reduce-emi">Reduce EMI amount</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPrepaymentDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddPrepayment}>Add Prepayment</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {prepayments.length > 0 ? (
            <div className="space-y-2">
              {prepayments.map((prepayment, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md text-sm">
                  <div>
                    <span className="font-medium">₹{prepayment.amount.toLocaleString()}</span> on {format(new Date(prepayment.date), "MMM d, yyyy")}
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({prepayment.option === 'reduce-tenure' ? 'Reduce tenure' : 'Reduce EMI'})
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removePrepayment(index)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground italic">No prepayments added</p>
          )}
        </div>
        
        {/* Rate Change section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-amber-500">
              <span className="font-semibold">Rate Change</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Add future interest rate changes</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Dialog open={rateChangeDialogOpen} onOpenChange={setRateChangeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-dashed border-amber-500 text-amber-500">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Interest Rate Change</DialogTitle>
                  <DialogDescription>
                    Enter details for interest rate changes
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-rate">New Interest Rate (%)</Label>
                    <Input
                      id="new-rate"
                      type="number"
                      step="0.1"
                      value={newRate || ""}
                      onChange={(e) => setNewRate(Number(e.target.value))}
                      placeholder="Enter new rate"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Effective From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !rateChangeDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {rateChangeDate ? format(rateChangeDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={rateChangeDate}
                          onSelect={setRateChangeDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRateChangeDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddRateChange}>Add Rate Change</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {rateChanges.length > 0 ? (
            <div className="space-y-2">
              {rateChanges.map((change, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md text-sm">
                  <div>
                    <span className="font-medium">{change.newRate}%</span> from {format(new Date(change.date), "MMM d, yyyy")}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeRateChange(index)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground italic">No rate changes scheduled</p>
          )}
        </div>
        
        {/* EMI Change section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2 text-blue-500">
              <span className="font-semibold">EMI Change</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Schedule changes to your EMI amount</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <Dialog open={emiChangeDialogOpen} onOpenChange={setEmiChangeDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="border-dashed border-blue-500 text-blue-500">
                  <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add EMI Change</DialogTitle>
                  <DialogDescription>
                    Enter details for EMI amount changes
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="new-emi">New EMI Amount (₹)</Label>
                    <Input
                      id="new-emi"
                      type="number"
                      value={newEmi || ""}
                      onChange={(e) => setNewEmi(Number(e.target.value))}
                      placeholder="Enter new EMI amount"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label>Effective From</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !emiChangeDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {emiChangeDate ? format(emiChangeDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={emiChangeDate}
                          onSelect={setEmiChangeDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setEmiChangeDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleAddEmiChange}>Add EMI Change</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {emiChanges.length > 0 ? (
            <div className="space-y-2">
              {emiChanges.map((change, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md text-sm">
                  <div>
                    <span className="font-medium">₹{change.newEmi.toLocaleString()}</span> from {format(new Date(change.date), "MMM d, yyyy")}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeEmiChange(index)}
                    className="h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground italic">No EMI adjustments scheduled</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedOptions;
