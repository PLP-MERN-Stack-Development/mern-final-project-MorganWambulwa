import { HeartHandshake, Mail, MapPin, Phone, Facebook, Twitter, Instagram } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Footer = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollTop = (e) => {
    e.preventDefault();
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-100 pt-10 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <a href="/" onClick={handleScrollTop} className="flex items-center gap-2 text-2xl font-bold text-white mb-6">
              <HeartHandshake className="h-8 w-8 text-emerald-400" />
              <span>FoodShare</span>
            </a>
            <p className="text-gray-400 leading-relaxed mb-6">
              Fighting hunger by connecting surplus food with those who need it most. Join the movement today.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"><Facebook className="h-5 w-5"/></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"><Twitter className="h-5 w-5"/></a>
              <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 transition-colors"><Instagram className="h-5 w-5"/></a>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Quick Links</h3>
            <ul className="space-y-4 text-gray-400">
              <li><a href="/" onClick={handleScrollTop} className="hover:text-emerald-400 transition-colors cursor-pointer">Home</a></li>
              <li><Link to={user ? "/dashboard" : "/auth"} className="hover:text-emerald-400 transition-colors">Donate Food</Link></li>
              <li><Link to={user ? "/dashboard" : "/auth"} className="hover:text-emerald-400 transition-colors">Request Food</Link></li>
              <li><Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Legal</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookies" className="hover:text-emerald-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-emerald-400 mt-1" />
                <span>Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-emerald-400" />
                <span>hello@foodshare.ke</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-emerald-400" />
                <span>+254 700 000 000</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} FoodShare Kenya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;