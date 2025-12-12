import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Package, CheckCircle, Truck, User } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const DeliveryTracker = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      const { data } = await api.get("/donations/deliveries");
      setDeliveries(data);
    } catch (error) {
      console.error("Fetch Deliveries Error:", error);
      // Only show toast if it's a real error, not just empty
      if (error.response && error.response.status !== 404) {
        toast.error("Failed to load deliveries");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
    const interval = setInterval(fetchDeliveries, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (id, status) => {
    // Optimistic UI update (feels faster)
    const originalDeliveries = [...deliveries];
    setDeliveries(deliveries.map(d => d._id === id ? { ...d, status } : d));

    try {
      // Send the status string directly in the body
      await api.patch(`/donations/deliveries/${id}`, { status: status });
      
      toast.success(`Status updated to ${status.replace('_', ' ')}`);
      fetchDeliveries(); // Refresh to ensure sync
    } catch (error) {
      console.error("Update Status Error:", error);
      // Revert optimistic update on failure
      setDeliveries(originalDeliveries);
      
      const msg = error.response?.data?.message || "Failed to update status";
      toast.error(msg);
    }
  };

  if (loading) return (
    <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
    </div>
  );

  if (deliveries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border-2 border-dashed">
        <Truck className="h-12 w-12 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">No active deliveries assigned.</p>
        <p className="text-sm text-gray-400">When donors assign you a delivery, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold text-gray-900">My Deliveries</h2>
      {deliveries.map((job) => (
        <Card key={job._id} className={`border-l-4 shadow-md ${job.status === 'Completed' ? 'border-l-gray-400 opacity-75' : 'border-l-emerald-500'}`}>
          <CardHeader className="pb-3 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5 text-emerald-600" />
                {job.donation?.title || "Donation Item"}
              </CardTitle>
              <Badge className={
                job.status === 'In Transit' ? 'bg-blue-100 text-blue-800' : 
                job.status === 'Completed' ? 'bg-gray-100 text-gray-800' : 
                'bg-emerald-100 text-emerald-800'
              }>
                {job.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-6">
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-3 text-emerald-700 font-bold uppercase text-xs tracking-wider">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  Pick Up From (Donor)
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 text-base flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" /> {job.donor?.name || "Unknown Donor"}
                  </p>
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-400" /> 
                    <span>{job.donation?.pickupLocation || "Location N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" /> 
                    <span>{job.donor?.phone || "No phone provided"}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold uppercase text-xs tracking-wider">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Deliver To (Receiver)
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-gray-900 text-base flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" /> {job.receiver?.name || "Unknown Receiver"}
                  </p>
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-400" /> 
                    <span>{job.receiver?.address || "Address details via phone"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4 text-gray-400" /> 
                    <span>{job.receiver?.phone || "No phone provided"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {job.status === 'Approved' && (
                <Button className="w-full bg-blue-600 hover:bg-blue-700 shadow-sm" onClick={() => updateStatus(job._id, 'In Transit')}>
                  <Truck className="mr-2 h-4 w-4" /> Confirm Pickup & Start
                </Button>
              )}
              {job.status === 'In Transit' && (
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 shadow-sm" onClick={() => updateStatus(job._id, 'Completed')}>
                  <CheckCircle className="mr-2 h-4 w-4" /> Mark as Delivered
                </Button>
              )}
              {job.status === 'Completed' && (
                <Button disabled className="w-full bg-gray-100 text-gray-500 border border-gray-200" variant="ghost">
                  <CheckCircle className="mr-2 h-4 w-4" /> Delivery Completed
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DeliveryTracker;