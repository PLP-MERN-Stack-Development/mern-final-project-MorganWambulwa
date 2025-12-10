import { useEffect, useState } from "react";
import api from "@/api/axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Clock, User, Phone, Truck, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import DeliveryPersonSelector from "./DeliveryPersonSelector"; // New Import

const RequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  // State to track which driver is selected for which request
  const [selectedDrivers, setSelectedDrivers] = useState({});

  const fetchRequests = async () => {
    try {
      // Fetch requests specifically received by the logged-in donor
      const { data } = await api.get("/donations/requests/received");
      setRequests(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Could not load incoming requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (requestId, status) => {
    setProcessingId(requestId);
    try {
      const payload = { status };
      
      // If the donor is approving the request, attach the selected driver (if any)
      if (status === 'Approved') {
        const driverId = selectedDrivers[requestId];
        // Only attach if a driver was actually selected (not "none")
        if (driverId && driverId !== 'none') {
          payload.deliveryPerson = driverId;
        }
      }

      await api.patch(`/donations/requests/${requestId}/status`, payload);
      
      toast.success(`Request marked as ${status}`);
      
      // Refresh the list to update status UI immediately
      fetchRequests();
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update request status");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50/50">
        <MessageSquare className="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <p className="text-gray-500 font-medium">No pending requests at the moment.</p>
        <p className="text-sm text-gray-400">When receivers request your food, they will appear here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Incoming Requests</h2>
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
          {requests.length} Active
        </Badge>
      </div>

      {requests.map((request) => (
        <Card key={request._id} className="overflow-hidden border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="bg-gray-50/80 pb-4 border-b border-gray-100">
            <div className="flex justify-between items-start gap-4">
              <div className="flex gap-4">
                {/* Donation Image Thumbnail */}
                <div className="flex-shrink-0">
                  {request.donation?.images?.[0] ? (
                    <img 
                      src={request.donation.images[0]} 
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200" 
                      alt="Donation" 
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500 font-medium">
                      No Img
                    </div>
                  )}
                </div>
                
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {request.donation?.title || "Unknown Item"}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3" />
                    Requested {format(new Date(request.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </CardDescription>
                </div>
              </div>
              
              {/* Status Badge */}
              <Badge 
                variant={request.status === 'Pending' ? 'outline' : 'default'}
                className={
                  request.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                  request.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''
                }
              >
                {request.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6 space-y-6">
            {/* Receiver Details */}
            <div className="flex items-start gap-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <div className="p-2.5 bg-white rounded-full shadow-sm text-blue-600">
                <User className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-gray-900 text-sm">
                  {request.receiver?.name || "Unknown User"}
                </p>
                <p className="text-xs text-blue-600 font-medium bg-blue-100/50 inline-block px-2 py-0.5 rounded-full">
                  {request.receiver?.organization || "Individual Receiver"}
                </p>
                <div className="flex flex-wrap gap-4 pt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded border border-blue-100">
                    <Phone className="h-3.5 w-3.5 text-blue-500" /> {request.receiver?.phone || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Request Message */}
            {request.message && (
              <div className="pl-4 border-l-4 border-gray-200">
                <p className="text-sm text-gray-500 font-medium mb-1">Message from receiver:</p>
                <p className="text-gray-700 italic">"{request.message}"</p>
              </div>
            )}

            {/* Driver Selection (Only visible if Pending) */}
            {request.status === 'Pending' && (
              <div className="space-y-3 pt-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Truck className="h-4 w-4 text-emerald-600" /> 
                  Assign a Driver (Optional)
                </label>
                <div className="max-w-md">
                  <DeliveryPersonSelector 
                    value={selectedDrivers[request._id] || "none"}
                    onValueChange={(val) => setSelectedDrivers(prev => ({ ...prev, [request._id]: val }))}
                  />
                  <p className="text-xs text-gray-500 mt-1.5">
                    Select a driver if you need help delivering this item. Otherwise, the receiver will pick it up.
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          {/* Action Buttons (Only visible if Pending) */}
          {request.status === 'Pending' && (
            <CardFooter className="bg-gray-50/80 flex gap-3 justify-end py-4 px-6 border-t border-gray-100">
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={() => handleStatusUpdate(request._id, 'Rejected')}
                disabled={processingId === request._id}
              >
                Reject
              </Button>
              <Button 
                className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                onClick={() => handleStatusUpdate(request._id, 'Approved')}
                disabled={processingId === request._id}
              >
                {processingId === request._id ? "Processing..." : "Approve & Assign"}
              </Button>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
};

export default RequestManagement;