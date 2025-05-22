
import { addMonths, format } from "date-fns";

// Calculate EMI using the formula: EMI = [P × r × (1+r)^n] ÷ [(1+r)^n - 1]
export const calculateEMI = (principal: number, interestRate: number, tenureYears: number) => {
  const r = interestRate / 12 / 100; // Monthly interest rate
  const n = tenureYears * 12; // Total number of months
  
  // EMI formula
  const emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  
  return Math.round(emi * 100) / 100; // Round to 2 decimal places
};

// Generate complete amortization schedule
export const generateAmortizationSchedule = (
  principal: number,
  interestRate: number,
  tenureYears: number,
  startDate: Date,
  prepayments: any[] = [],
  rateChanges: any[] = [],
  emiChanges: any[] = []
) => {
  let currentPrincipal = principal;
  let currentRate = interestRate;
  let monthlyEMI = calculateEMI(principal, interestRate, tenureYears);
  let remainingMonths = tenureYears * 12;
  
  const schedule: any[] = [];
  let totalPrincipalPaid = 0;
  let currentDate = new Date(startDate);
  
  // Helper function to sort events by date
  const sortByDate = (a: any, b: any) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  };
  
  for (let month = 1; month <= remainingMonths; month++) {
    // Apply rate changes if any
    const applicableRateChange = rateChanges
      .filter(change => {
        const changeDate = new Date(change.date);
        return changeDate <= currentDate && change.applied !== true;
      })
      .sort(sortByDate)
      .pop();
      
    if (applicableRateChange) {
      currentRate = applicableRateChange.newRate;
      // Recalculate EMI with new interest rate
      monthlyEMI = calculateEMI(currentPrincipal, currentRate, remainingMonths / 12);
      applicableRateChange.applied = true;
    }
    
    // Apply EMI changes if any
    const applicableEmiChange = emiChanges
      .filter(change => {
        const changeDate = new Date(change.date);
        return changeDate <= currentDate && change.applied !== true;
      })
      .sort(sortByDate)
      .pop();
      
    if (applicableEmiChange) {
      monthlyEMI = applicableEmiChange.newEmi;
      applicableEmiChange.applied = true;
    }
    
    // Calculate interest for the current month
    const monthlyRate = currentRate / 12 / 100;
    const interestForMonth = currentPrincipal * monthlyRate;
    
    // Principal component of the EMI
    let principalForMonth = monthlyEMI - interestForMonth;
    
    // Ensure principal doesn't exceed remaining principal
    principalForMonth = Math.min(principalForMonth, currentPrincipal);
    
    // Check for prepayments
    const applicablePrepayment = prepayments
      .filter(prepayment => {
        const prepaymentDate = new Date(prepayment.date);
        return prepaymentDate <= currentDate && prepayment.applied !== true;
      })
      .sort(sortByDate)
      .pop();
    
    let prepaymentAmount = 0;
    if (applicablePrepayment) {
      prepaymentAmount = applicablePrepayment.amount;
      applicablePrepayment.applied = true;
      
      // Adjust principal based on prepayment choice
      if (applicablePrepayment.option === 'reduce-tenure') {
        // Reduce tenure - EMI remains same
        currentPrincipal = Math.max(0, currentPrincipal - prepaymentAmount);
      } else {
        // Reduce EMI - tenure remains same
        currentPrincipal = Math.max(0, currentPrincipal - prepaymentAmount);
        monthlyEMI = calculateEMI(currentPrincipal, currentRate, remainingMonths / 12);
      }
    }
    
    // Update current principal and total paid
    currentPrincipal = Math.max(0, currentPrincipal - principalForMonth);
    totalPrincipalPaid += principalForMonth;
    
    // Add month to schedule
    schedule.push({
      month,
      date: format(currentDate, 'MMM yyyy'),
      rawDate: new Date(currentDate),
      principalPayment: principalForMonth,
      interestPayment: interestForMonth,
      emi: monthlyEMI,
      prepayment: prepaymentAmount,
      totalPayment: principalForMonth + interestForMonth + prepaymentAmount,
      principalPaid: totalPrincipalPaid,
      balance: currentPrincipal,
      interestRate: currentRate
    });
    
    // Move to next month
    currentDate = addMonths(currentDate, 1);
    
    // If loan is fully paid, break the loop
    if (currentPrincipal <= 0) {
      break;
    }
  }
  
  return schedule;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatPercentage = (value: number) => {
  return `${value.toFixed(2)}%`;
};
