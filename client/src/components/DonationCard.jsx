import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";
import { format } from "date-fns";

const DonationCard = ({ donation, userType, onRequest, onView }) => {
  // Use a fallback image if none provided
  const displayImage = donation.image || "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80";

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/50">
      <div className="aspect-video overflow-hidden relative">
        <img
          src={displayImage}
          alt={donation.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
        />
        <div className="absolute top-2 right-2">
          <Badge className={donation.status === 'Available' ? 'bg-emerald-500' : 'bg-gray-500'}>
            {donation.status}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold truncate">{donation.title}</CardTitle>
        </div>
        <CardDescription className="line-clamp-2 mt-1">
          {donation.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <MapPin className="h-4 w-4 text-primary" />
          <span className="truncate">{donation.pickupLocation}</span>
        </div>
        
        {donation.bestBefore && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>Expires: {format(new Date(donation.bestBefore), "MMM d, h:mm a")}</span>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary">{donation.foodType}</Badge>
          <Badge variant="outline">{donation.quantity}</Badge>
        </div>
      </CardContent>
      
      <CardFooter className="gap-2 pt-0">
        {userType === "receiver" && donation.status === "Available" && (
          <Button onClick={() => onRequest && onRequest(donation._id)} className="flex-1 bg-gradient-hero text-white">
            Request
          </Button>
        )}
        <Button variant="outline" onClick={() => onView && onView(donation._id)} className="flex-1 border-primary text-primary hover:bg-primary/5">
          Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DonationCard;