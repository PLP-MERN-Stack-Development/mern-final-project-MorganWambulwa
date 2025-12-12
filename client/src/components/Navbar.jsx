import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HeartHandshake, Menu, X, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    setIsMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        if (sectionId === "home") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const element = document.getElementById(sectionId);
          element?.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      if (sectionId === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const element = document.getElementById(sectionId);
        element?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <button 
          onClick={() => scrollToSection("home")} 
          className="flex items-center gap-2 text-2xl font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          <HeartHandshake className="h-8 w-8" />
          <span>FoodShare</span>
        </button>
        
        {/* DESKTOP MENU - Added "About Us" */}
        <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
          <button onClick={() => scrollToSection("home")} className="hover:text-emerald-600 transition-colors">Home</button>
          <button onClick={() => scrollToSection("how-it-works")} className="hover:text-emerald-600 transition-colors">About Us</button> {/* Renamed/Linked */}
          <button onClick={() => scrollToSection("impact")} className="hover:text-emerald-600 transition-colors">Impact</button>
        </div>

        {/* AUTH BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/profile" className="group flex items-center gap-3 pl-4 border-l border-gray-200 hover:opacity-80 transition-opacity" title="Edit Profile">
                <Avatar className="h-9 w-9 border border-gray-200 shadow-sm cursor-pointer group-hover:border-emerald-300 transition-colors">
                  <AvatarImage src={user.avatar} alt={user.name} className="object-cover" />
                  <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold text-gray-900 leading-none group-hover:text-emerald-700 transition-colors">{user.name}</p>
                  <p className="text-xs text-emerald-600 font-medium capitalize mt-1">{user.role}</p>
                </div>
              </Link>

              <Link to="/dashboard">
                <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm h-9 px-4 text-sm">
                  <LayoutDashboard className="h-4 w-4 mr-2" /> Dashboard
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleSignOut}
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 h-9 w-9"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" className="text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 font-medium">
                  Sign In
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE TOGGLE */}
        <div className="md:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md focus:outline-none"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl absolute w-full left-0 animate-in slide-in-from-top-5 duration-200">
          <div className="p-4 space-y-4">
            <div className="space-y-2 border-b border-gray-100 pb-4">
              <button onClick={() => scrollToSection("home")} className="block w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 font-medium text-gray-700">
                Home
              </button>
              <button onClick={() => scrollToSection("how-it-works")} className="block w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 font-medium text-gray-700">
                About Us
              </button>
              <button onClick={() => scrollToSection("impact")} className="block w-full text-left py-2 px-3 rounded-md hover:bg-gray-50 font-medium text-gray-700">
                Impact
              </button>
            </div>
            
            <div className="pt-2 flex flex-col gap-3">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                      <Avatar className="h-10 w-10 border border-white shadow-sm">
                        <AvatarImage src={user.avatar} className="object-cover" />
                        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-emerald-600 capitalize font-medium">{user.role} Account</p>
                      </div>
                    </div>
                  </Link>

                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 justify-start">
                      <LayoutDashboard className="h-4 w-4 mr-2" /> Go to Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 justify-start" 
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-center border-gray-300 text-gray-700">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white justify-center shadow-md">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;