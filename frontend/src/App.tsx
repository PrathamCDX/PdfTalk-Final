import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Landing from "./pages/Landing";
import { createContext, useState } from "react";

const queryClient = new QueryClient();

interface AuthContextType {
  googleAuth: string;
  setGoogleAuth: React.Dispatch<React.SetStateAction<string>>;
}
const authContext = createContext<AuthContextType | undefined>(undefined);

const App = () => {
  const [googleAuth, setGoogleAuth] = useState("");
  return (
    <GoogleOAuthProvider clientId="686678939208-qqfkudeirh33sn5qbtevvvsq0mao9sjs.apps.googleusercontent.com">
      <QueryClientProvider client={queryClient}>
        <authContext.Provider value={{ googleAuth, setGoogleAuth }}>
          <ThemeProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/app" element={<Index />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </ThemeProvider>
        </authContext.Provider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
export { authContext };
