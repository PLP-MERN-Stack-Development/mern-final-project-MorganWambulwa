import { useState, useEffect } from "react";
import api from "../api/axios"; // Use your new Axios instance
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  MapPin,
  Phone,
  User
} from "lucide-react";
import { format } from "date-fns";

const statusSteps = [
  { key: "assigned", label: "Assigned", icon: Clock },
  { key: "in_transit", label: "In Transit", icon: Truck },
  { key: "delivered", label: "Delivered", icon: CheckCircle2 },
];

const DeliveryTracker = ({ userId, userType }) => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    // Prevent loading spinner on background refreshes if we already have data
    if (deliveries.length === 0) setLoading(true);
    
    try {
      // Fetch deliveries relevant to the user (Backend should filter by userType/userId from token)
      const { data } = await api.get("/deliveries");
      setDeliveries(data);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      toast.error("Failed to load deliveries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();

    // Polling: Refresh every 30 seconds to simulate real-time updates
    // In a full MERN app with Socket.io, you'd listen for events here instead.
    const interval = setInterval(fetchDeliveries, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  const updateDeliveryStatus = async (deliveryId, newStatus) => {
    try {
      // Optimistic UI update (optional, but makes it feel fast)
      const updatedDeliveries = deliveries.map(d => 
        d._id === deliveryId ? { ...d, status: newStatus } : d
      );
      setDeliveries(updatedDeliveries);

      // Call Backend
      await api.patch(`/deliveries/${deliveryId}/status`, { status: newStatus });

      toast.success(`Delivery marked as ${newStatus.replace("_", " ")}`);
      
      // Refresh to get exact server timestamps (e.g. pickup_time)
      fetchDeliveries();
    } catch (error) {
      console.error("Error updating delivery:", error);
      toast.error(error.response?.data?.message || "Failed to update delivery status");
      // Revert optimistic update on failure
      fetchDeliveries(); 
    }
  };

  const getStatusIndex = (status) => {
    if (status === "failed") return -1;
    return statusSteps.findIndex((s) => s.key === status);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "assigned":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Assigned
          </Badge>
        );
      case "in_transit":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
            <Truck className="w-3 h-3 mr-1" />
            In Transit
          </Badge>
        );
      case "delivered":
        return (
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Delivered
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  if (deliveries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Truck className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No deliveries yet</h3>
          <p className="text-muted-foreground text-center">
            Deliveries will appear here once donation requests are approved.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {deliveries.map((delivery) => {
        const currentStep = getStatusIndex(delivery.status);

        return (
          <Card key={delivery._id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {delivery.donation?.title || "Donation"}
                </CardTitle>
                {getStatusBadge(delivery.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Progress Timeline */}
              {delivery.status !== "failed" && (
                <div className="flex items-center justify-between relative">
                  <div className="absolute top-4 left-0 right-0 h-1 bg-muted" />
                  <div
                    className="absolute top-4 left-0 h-1 bg-primary transition-all duration-500"
                    style={{
                      width: `${(currentStep / (statusSteps.length - 1)) * 100}%`,
                    }}
                  />
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                      <div
                        key={step.key}
                        className="flex flex-col items-center relative z-10"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                            isCompleted
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          } ${isCurrent ? "ring-2 ring-primary ring-offset-2" : ""}`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span
                          className={`text-xs mt-2 ${
                            isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                          }`}
                        >
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Delivery Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-foreground">Pickup Location</h4>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{delivery.donation?.pickupLocation || "Not specified"}</span>
                  </div>
                </div>

                {delivery.receiver && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-foreground">Deliver To</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{delivery.receiver.name}</span>
                      </div>
                      {delivery.receiver.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span>{delivery.receiver.phone}</span>
                        </div>
                      )}
                      {delivery.receiver.address && (
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5" />
                          <span>{delivery.receiver.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground pt-2">
                <span>Created: {delivery.createdAt ? format(new Date(delivery.createdAt), "PPp") : "N/A"}</span>
                {delivery.pickupTime && (
                  <span>Picked up: {format(new Date(delivery.pickupTime), "PPp")}</span>
                )}
                {delivery.deliveryTime && (
                  <span>Delivered: {format(new Date(delivery.deliveryTime), "PPp")}</span>
                )}
              </div>

              {/* Actions for delivery person */}
              {userType === "delivery" && delivery.status !== "delivered" && delivery.status !== "failed" && (
                <div className="flex gap-2 pt-2">
                  {delivery.status === "assigned" && (
                    <Button
                      size="sm"
                      onClick={() => updateDeliveryStatus(delivery._id, "in_transit")}
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      Start Delivery
                    </Button>
                  )}
                  {delivery.status === "in_transit" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateDeliveryStatus(delivery._id, "delivered")}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark Delivered
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateDeliveryStatus(delivery._id, "failed")}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Mark Failed
                      </Button>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DeliveryTracker;