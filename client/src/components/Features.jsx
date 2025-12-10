import { Card, CardContent } from "@/components/ui/card";
import { HeartHandshake, Truck, Utensils } from "lucide-react";

const features = [
  {
    icon: Utensils,
    title: "Donate Surplus Food",
    description: "Restaurants and individuals can easily post available food for donation through our platform. Snap a photo, add details, and post.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-100"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Integrated with local delivery services to ensure quick and efficient food distribution before it spoils.",
    color: "text-blue-600",
    bgColor: "bg-blue-100"
  },
  {
    icon: HeartHandshake,
    title: "Request & Receive",
    description: "Families and food banks can browse live maps and request food donations based on their immediate needs.",
    color: "text-rose-600",
    bgColor: "bg-rose-100"
  },
];

const Features = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            How FoodShare Works
          </h2>
          <p className="text-xl text-gray-600">
            A simple, efficient platform connecting surplus food with those in need in three simple steps.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white"
              >
                <CardContent className="pt-10 pb-8 px-8 text-center h-full flex flex-col items-center">
                  <div className={`w-20 h-20 mb-6 rounded-2xl ${feature.bgColor} flex items-center justify-center p-4 shadow-inner`}>
                    <Icon className={`w-10 h-10 ${feature.color}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;