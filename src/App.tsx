
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SIPCalculator from "./pages/SIPCalculator";
import FDCalculator from "./pages/FDCalculator";
import LumpsumCalculator from "./pages/LumpsumCalculator";
import RDCalculator from "./pages/RDCalculator";
import PPFCalculator from "./pages/PPFCalculator";
import RetirementCalculator from "./pages/RetirementCalculator";
import IncomeTaxCalculator from "./pages/IncomeTaxCalculator";
import NPSCalculator from "./pages/NPSCalculator";
import InflationCalculator from "./pages/InflationCalculator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Index />} />
          <Route path="/sip-calculator" element={<SIPCalculator />} />
          <Route path="/fd-calculator" element={<FDCalculator />} />
          <Route path="/lumpsum-calculator" element={<LumpsumCalculator />} />
          <Route path="/rd-calculator" element={<RDCalculator />} />
          <Route path="/ppf-calculator" element={<PPFCalculator />} />
          <Route path="/retirement-calculator" element={<RetirementCalculator />} />
          <Route path="/income-tax-calculator" element={<IncomeTaxCalculator />} />
          <Route path="/nps-calculator" element={<NPSCalculator />} />
          <Route path="/inflation-calculator" element={<InflationCalculator />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
