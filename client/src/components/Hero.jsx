import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const { user } = useAuth();
  // Using a community-focused background image similar to the reference
  const heroImage = "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80";

  return (
    <section className="relative min-h-[85vh] flex items-center pt-20 overflow-hidden" id="home">
      
      {/* Background Image with Dark Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/50" /> 
      </div>
      
      <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
        <div className="max-w-4xl">
          <div className="inline-block px-4 py-1 mb-6 text-xs font-bold tracking-widest text-orange-400 uppercase bg-black/60 rounded-full backdrop-blur-sm border border-orange-500/30">
            Zero Hunger Initiative
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6 drop-shadow-xl uppercase tracking-tight">
            Fighting Hunger, <br/>
            <span className="text-orange-500">Feeding Hope.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-emerald-50 mb-10 font-medium leading-relaxed max-w-2xl drop-shadow-md">
            Join the movement to end hunger in Nairobi County. We connect surplus food with the neighbors who need it most.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            {/* BORROWED IDEA: High Contrast "Donate" Button (Orange) */}
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-lg px-10 py-7 uppercase tracking-wider shadow-xl transform transition hover:scale-105 border-none">
                Start Donating
              </Button>
            </Link>
            
            {/* BORROWED IDEA: Distinct "Find Help" Button (Rose/Red) */}
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button size="lg" className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-lg px-10 py-7 uppercase tracking-wider shadow-xl border-none">
                Find Food
              </Button>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="mt-16 flex flex-wrap gap-8 md:gap-16 pt-8 border-t border-white/20">
            <div>
              <div className="text-4xl font-black text-white">2.5K+</div>
              <div className="text-sm font-bold text-orange-400 uppercase tracking-widest">Meals Shared</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">150+</div>
              <div className="text-sm font-bold text-orange-400 uppercase tracking-widest">Active Donors</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">100%</div>
              <div className="text-sm font-bold text-orange-400 uppercase tracking-widest">Verified NGO</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;