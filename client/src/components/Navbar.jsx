import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Menu, X, User as UserIcon, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      element?.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors">
          <HeartHandshake className="h-8 w-8" />
          <span>FoodShare</span>
        </Link>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <button onClick={() => scrollToSection("how-it-works")} className="hover:text-emerald-600 transition-colors">How It Works</button>
          <button onClick={() => scrollToSection("impact")} className="hover:text-emerald-600 transition-colors">Our Impact</button>
          <button onClick={() => scrollToSection("about")} className="hover:text-emerald-600 transition-colors">About</button>
        </div>

        {/* Auth / User Section */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-900 leading-none">{user.name}</p>
                <p className="text-xs text-emerald-600 font-medium capitalize mt-1">{user.role}</p>
              </div>
              <Link to="/dashboard">
                <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-md">Dashboard</Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSignOut}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                title="Sign Out"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" className="hover:bg-emerald-50 text-emerald-700 font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-gradient-hero shadow-md hover:shadow-lg transition-all">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-md">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t p-4 space-y-4 shadow-xl absolute w-full animate-in slide-in-from-top-2">
          <button onClick={() => scrollToSection("how-it-works")} className="block w-full text-left py-2 font-medium text-gray-700">How It Works</button>
          <button onClick={() => scrollToSection("impact")} className="block w-full text-left py-2 font-medium text-gray-700">Our Impact</button>
          
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 py-2 bg-gray-50 p-3 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                    <p className="text-xs text-emerald-600 capitalize">{user.role}</p>
                  </div>
                </div>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-emerald-600">Go to Dashboard</Button>
                </Link>
                <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full bg-gradient-hero">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;