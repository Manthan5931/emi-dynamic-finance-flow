
/**
 * Calculate the final value of a SIP investment
 * @param monthlyInvestment - The amount invested each month
 * @param expectedReturnRate - Annual expected return rate (in percentage)
 * @param timePeriod - Investment period in years
 * @param inflationRate - Annual inflation rate (in percentage)
 * @returns Object containing investment details and schedule
 */
export const calculateSIP = (
  monthlyInvestment: number,
  expectedReturnRate: number, 
  timePeriod: number,
  inflationRate: number = 0
): {
  totalInvestment: number;
  totalReturns: number;
  maturityValue: number;
  inflationAdjustedValue: number;
  schedule: any[];
} => {
  // Convert annual rate to monthly
  const monthlyRate = expectedReturnRate / 12 / 100;
  const months = timePeriod * 12;
  
  // SIP formula: M × (((1 + r)^n - 1) / r) × (1 + r)
  // Where M is monthly investment, r is monthly rate, n is number of months
  const maturityValue = monthlyInvestment * 
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
    (1 + monthlyRate));
  
  const totalInvestment = monthlyInvestment * months;
  const totalReturns = maturityValue - totalInvestment;
  
  // Inflation adjustment
  let inflationAdjustedValue = maturityValue;
  if (inflationRate > 0) {
    const effectiveRate = (1 + expectedReturnRate / 100) / (1 + inflationRate / 100) - 1;
    inflationAdjustedValue = totalInvestment * Math.pow(1 + effectiveRate, timePeriod);
  }
  
  // Generate monthly schedule
  const schedule = generateSIPSchedule(monthlyInvestment, expectedReturnRate, timePeriod);
  
  return {
    totalInvestment,
    totalReturns,
    maturityValue,
    inflationAdjustedValue,
    schedule
  };
};

/**
 * Generate a month-by-month SIP investment schedule
 * @param monthlyInvestment - The amount invested each month
 * @param expectedReturnRate - Annual expected return rate (in percentage)
 * @param timePeriod - Investment period in years
 * @returns Array containing monthly investment details
 */
export const generateSIPSchedule = (
  monthlyInvestment: number,
  expectedReturnRate: number,
  timePeriod: number
): any[] => {
  const monthlyRate = expectedReturnRate / 12 / 100;
  const months = timePeriod * 12;
  const schedule = [];
  
  let totalInvestment = 0;
  let totalValue = 0;
  
  for (let month = 1; month <= months; month++) {
    totalInvestment += monthlyInvestment;
    
    // Calculate value at the end of this month
    // Previous month value with growth + new investment
    totalValue = (totalValue * (1 + monthlyRate)) + monthlyInvestment;
    
    const interestEarned = totalValue - totalInvestment;
    
    const date = new Date();
    date.setMonth(date.getMonth() + month);
    
    schedule.push({
      month,
      date,
      investment: monthlyInvestment,
      totalInvestment,
      interestEarned,
      totalValue
    });
  }
  
  return schedule;
};

/**
 * Calculate the monthly investment needed to reach a target amount
 * @param targetAmount - Target amount to achieve
 * @param expectedReturnRate - Annual expected return rate (in percentage)
 * @param timePeriod - Investment period in years
 * @returns Monthly investment amount needed
 */
export const calculateMonthlyInvestmentForTarget = (
  targetAmount: number,
  expectedReturnRate: number,
  timePeriod: number
): number => {
  const monthlyRate = expectedReturnRate / 12 / 100;
  const months = timePeriod * 12;
  
  // Rearranged SIP formula to solve for monthly investment
  // M = P / ((((1 + r)^n - 1) / r) × (1 + r))
  // Where P is target amount, r is monthly rate, n is number of months
  const monthlyInvestment = targetAmount / 
    (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * 
    (1 + monthlyRate));
  
  return monthlyInvestment;
};
