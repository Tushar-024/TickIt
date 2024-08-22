// import { Toaster } from "@/components/ui/sonner";
import { Toaster } from 'sonner'
// import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";

const App = () => (
  
  <BrowserRouter>
  <Toaster />
    <Routes>
      {navItems.map(({ to, page }) => (
        <Route key={to} path={to} element={page} />
      ))}
    </Routes>
  </BrowserRouter>
);

export default App;
