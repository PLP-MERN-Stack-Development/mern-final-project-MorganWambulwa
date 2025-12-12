import { Link } from "react-router-dom";

const features = [
  {
    title: "HOW IT WORKS",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&q=80", // Fresh Veggies
    link: "/how-it-works",
    description: "See how we connect surplus to scarcity."
  },
  {
    title: "HUNGER IN KENYA",
    image: "https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&q=80", // Community/People
    link: "/about",
    description: "Understand the impact of food insecurity."
  },
  {
    title: "WAYS TO GIVE",
    image: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80", // Healthy Food
    link: "/auth",
    description: "Donate food, time, or funds."
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link to={feature.link} key={index} className="group relative h-80 overflow-hidden shadow-lg cursor-pointer">
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${feature.image})` }}
              />
              
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300" />
              
              {/* Text Box (Bordered like reference) */}
              <div className="absolute inset-4 border-2 border-white/80 flex flex-col items-center justify-center p-4 text-center">
                <h3 className="text-3xl md:text-4xl font-black text-white uppercase leading-none drop-shadow-lg mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/0 group-hover:text-white/90 transition-all duration-300 font-medium translate-y-4 group-hover:translate-y-0">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;