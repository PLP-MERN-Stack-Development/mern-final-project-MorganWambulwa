import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  const heroImage = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80";

  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 hover:scale-105"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/20" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-emerald-800 uppercase bg-emerald-100 rounded-full">
            Zero Hunger Initiative
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 text-gray-900 leading-tight tracking-tight">
            Fighting Hunger, <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              One Meal at a Time
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-2xl">
            Connect surplus food from restaurants, hotels, and individuals with the communities that need it most. 
            Join 150+ donors making a difference today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-hero hover:opacity-90 text-lg px-8 py-6 shadow-xl shadow-emerald-200 group w-full sm:w-auto">
                Start Donating
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-emerald-200 text-emerald-700 hover:bg-emerald-50 w-full sm:w-auto">
                Request Food
              </Button>
            </Link>
          </div>
          
          <div className="mt-12 flex gap-12 pt-8 border-t border-gray-200">
            <div>
              <div className="text-3xl font-bold text-gray-900">2.5K+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Meals Donated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">150+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Active Donors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">Families Helped</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;