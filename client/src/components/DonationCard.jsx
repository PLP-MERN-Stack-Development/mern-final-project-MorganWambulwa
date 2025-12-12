import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, ImageOff, Trash2 } from "lucide-react";
import { format } from "date-fns";

const DonationCard = ({ donation, userType, onRequest, onView, onDelete }) => {
  const isAvailable = donation.status === 'Available';
  const hasImage = donation.image && donation.image.length > 0;

  return (
    <Card className="group h-full border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-[1.5rem] overflow-hidden bg-white flex flex-col relative">
      
      {/* Delete Action (Donor) */}
      {userType === 'donor' && onDelete && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDelete(donation._id); }}
          className="absolute top-3 left-3 z-10 p-2 bg-white/80 hover:bg-red-50 text-red-500 rounded-full backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all shadow-sm"
          title="Delete Donation"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      )}

      {/* Image Area - Full Bleed */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        {hasImage ? (
          <img 
            src={donation.image} 
            alt={donation.title} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-slate-300">
            <ImageOff className="h-10 w-10 mb-2 opacity-50" />
            <span className="text-xs font-semibold uppercase tracking-widest">No Image</span>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <Badge className={`${isAvailable ? 'bg-emerald-500' : 'bg-slate-500'} text-white border-none shadow-lg px-3 py-1`}>
            {donation.status}
          </Badge>
        </div>
        
        {/* Gradient Overlay for text readability if needed, mostly style */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      </div>

      {/* Content Area */}
      <CardContent className="flex-grow p-6 pt-5 space-y-4">
        <div>
          <div className="flex justify-between items-start mb-1">
            <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50 font-medium px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wide">
              {donation.foodType}
            </Badge>
            {donation.bestBefore && (
              <div className="flex items-center gap-1 text-xs text-slate-400 font-medium" title="Best Before Date">
                <Clock className="h-3 w-3" />
                {format(new Date(donation.bestBefore), "MMM d")}
              </div>
            )}
          </div>
          <h3 className="text-xl font-bold text-slate-900 leading-tight line-clamp-1 group-hover:text-emerald-700 transition-colors">
            {donation.title}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-sm text-slate-500">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{donation.pickupLocation}</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
          {donation.description}
        </p>

        {userType === 'receiver' && (
          <div className="pt-3 mt-2 border-t border-slate-50 flex items-center gap-2 text-xs text-slate-400 font-medium">
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <User className="h-3 w-3" />
            </div>
            <span>Posted by {donation.donor?.name || "Anonymous"}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 mt-auto grid grid-cols-2 gap-3">
        {userType === 'receiver' && isAvailable ? (
          <>
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
              onClick={() => onRequest(donation._id)}
            >
              Request
            </Button>
            <Button 
              variant="outline" 
              className="border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-medium" 
              onClick={() => onView(donation._id)}
            >
              Details
            </Button>
          </>
        ) : (
          <Button 
            variant="outline" 
            className="w-full col-span-2 border-slate-200 text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl font-medium transition-all" 
            onClick={() => onView(donation._id)}
          >
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DonationCard;