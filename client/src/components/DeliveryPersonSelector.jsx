import { useEffect, useState } from "react";
import api from "@/api/axios"; // Updated to use the @ alias for consistency
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Truck, User, AlertCircle } from "lucide-react";

const DeliveryPersonSelector = ({ value, onValueChange, disabled }) => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeliveryPersons = async () => {
      try {
        setLoading(true);
        // FIX: The endpoint must match the server route we created in 'authRoutes.js'
        // The server controller 'getDrivers' handles the role filtering automatically
        const { data } = await api.get("/auth/drivers");
        
        setDeliveryPersons(data || []);
      } catch (error) {
        console.error("Error fetching delivery persons:", error);
        setError("Failed to load drivers");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryPersons();
  }, []);

  if (loading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 p-2 text-sm text-red-500 bg-red-50 rounded-md">
        <AlertCircle className="h-4 w-4" />
        <span>Error loading drivers</span>
      </div>
    );
  }

  // If no drivers exist in the system, show a helpful message
  if (deliveryPersons.length === 0) {
    return (
      <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground border border-dashed border-gray-200">
        <Truck className="h-4 w-4" />
        <span>No drivers available. Receiver must pickup.</span>
      </div>
    );
  }

  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full h-12">
        <SelectValue placeholder="Select a driver (optional)" />
      </SelectTrigger>
      <SelectContent>
        {/* Option for No Driver / Receiver Pickup */}
        <SelectItem value="none">
          <div className="flex items-center gap-3 py-1">
            <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-medium text-gray-900">No Driver Needed</span>
              <span className="text-xs text-gray-500">Receiver will handle pickup</span>
            </div>
          </div>
        </SelectItem>

        {/* List of Real Drivers */}
        {deliveryPersons.map((person) => (
          <SelectItem key={person._id} value={person._id}>
            <div className="flex items-center gap-3 py-1">
              <Avatar className="h-8 w-8 border border-gray-200">
                <AvatarImage src={person.avatar} alt={person.name} />
                <AvatarFallback className="bg-emerald-100 text-emerald-700 font-medium text-xs">
                  {person.name ? person.name.charAt(0).toUpperCase() : 'D'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-left">
                <span className="font-medium text-gray-900">{person.name}</span>
                <span className="text-xs text-gray-500">
                  {person.phone || person.email}
                </span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DeliveryPersonSelector;