import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Hero = () => {
  const { user } = useAuth();
  const heroImage = "https://images.unsplash.com/photo-1665332195309-9d75071138f0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  return (
    <section className="relative min-h-[60vh] flex items-center pt-20 overflow-hidden" id="home">
      
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
            Fighting Hunger <br/>
            <span className="text-orange-500">In Nairobi County</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-emerald-50 mb-10 font-medium leading-relaxed max-w-2xl drop-shadow-md">
            Connect surplus food from restaurants, hotels, and individuals with the communities that need it most. 
            Join the movement to end hunger today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-lg px-10 py-7 uppercase tracking-wider shadow-xl transform transition hover:scale-105 border-none">
                Start Donating
              </Button>
            </Link>
            
            <Link to={user ? "/dashboard" : "/auth"}>
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-lg px-10 py-7 uppercase tracking-wider shadow-xl">
                Get Involved
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;