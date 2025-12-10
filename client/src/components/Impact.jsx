import { Card, CardContent } from "@/components/ui/card";
import { Users, TrendingUp, Heart, Leaf } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "500+",
    label: "Families Supported",
    color: "text-emerald-600",
  },
  {
    icon: TrendingUp,
    value: "2.5K+",
    label: "Meals Donated",
    color: "text-blue-600",
  },
  {
    icon: Heart,
    value: "150+",
    label: "Active Donors",
    color: "text-rose-600",
  },
  {
    icon: Leaf,
    value: "1.2 Tons",
    label: "Food Waste Reduced",
    color: "text-green-600",
  },
];

const Impact = () => {
  return (
    <section id="impact" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Our Growing Impact
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Together, we're making a real difference in fighting hunger across Kenya
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index}
                className="border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="pt-10 pb-8 text-center">
                  <Icon className={`h-14 w-14 mx-auto mb-6 ${stat.color}`} />
                  <div className="text-4xl font-extrabold mb-2 text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 font-medium uppercase tracking-wide text-sm">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Impact;