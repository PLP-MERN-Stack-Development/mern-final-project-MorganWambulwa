import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Heart, Users, Globe, ArrowRight } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <section className="pt-24 pb-12 text-white" style={{ backgroundColor: 'rgb(17 24 39 / var(--tw-bg-opacity, 1))' }}>
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Nourishing Communities,<br/> 
            <span className="text-orange-300">One Connection at a Time.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            We are on a mission to eliminate hunger and reduce food waste in Nairobi County through technology and community action.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1455849318743-b2233052fcff?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Community Food Share" 
                className="rounded-none shadow-2xl border-4 border-orange-100"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tight">Our Story</h2>
              <div className="h-1 w-20 bg-orange-500"></div>
              <p className="text-lg text-gray-600 leading-relaxed">
                Founded in 2025, FoodShare began with a simple observation: while restaurants and hotels threw away surplus food, families just a few blocks away were going hungry.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                We built a platform to bridge this gap. Today, FoodShare connects hundreds of donors with local shelters, food banks, and individuals, creating a seamless logistics network that ensures good food goes to people, not landfills.
              </p>
              <div className="pt-4">
                <Link to="/auth">
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg font-bold uppercase tracking-wider shadow-lg">
                    Join Our Mission <ArrowRight className="ml-2 h-5 w-5"/>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-stone-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">What Drives Us</h2>
            <div className="h-1 w-24 bg-orange-500 mx-auto mt-4"></div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 shadow-lg border-t-4 border-orange-500 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center uppercase tracking-wide">Compassion First</h3>
              <p className="text-gray-600 text-center leading-relaxed">We believe access to nutritious food is a fundamental human right, not a privilege.</p>
            </div>

            <div className="bg-white p-10 shadow-lg border-t-4 border-[#657B36] hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-[#eff5e0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#657B36]">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center uppercase tracking-wide">Community Led</h3>
              <p className="text-gray-600 text-center leading-relaxed">We don't just deliver food; we build relationships between neighbors and local businesses.</p>
            </div>

            <div className="bg-white p-10 shadow-lg border-t-4 border-orange-500 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 text-orange-600">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center uppercase tracking-wide">Sustainability</h3>
              <p className="text-gray-600 text-center leading-relaxed">Reducing food waste is one of the most effective ways to combat climate change.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;