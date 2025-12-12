import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DonationCard from "@/components/DonationCard";
import CreateDonationForm from "@/components/CreateDonationForm";
import RequestManagement from "@/components/RequestManagement";
import DeliveryTracker from "@/components/DeliveryTracker";
import DonationsMap from "@/components/DonationsMap"; 
import { useAuth } from "../context/AuthContext";
import { 
  PlusCircle, 
  Search, 
  Filter, 
  X, 
  Package, 
  AlertCircle, 
  ArrowLeft,
  Calendar,
  ImageOff,
  Trash2,
  MapPin
} from "lucide-react";
import api from "@/api/axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

const FALLBACK_DONATIONS = [
  { _id: "demo-1", title: "Demo Vegetables", foodType: "Vegetables", quantity: "15kg", pickupLocation: "Nairobi", status: "Available", donor: { name: "Demo User" } }
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  
  const [donations, setDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]); 
  
  const [loading, setLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [error, setError] = useState(null);

  const getDefaultTab = () => {
    if (user?.role === 'driver') return 'deliveries';
    if (user?.role === 'donor') return 'donations';
    return 'overview';
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (user?.role === 'driver') {
        setLoading(false);
      } else if (user?.role === 'donor') {
        const { data } = await api.get('/donations/my');
        setDonations(data);
        setLoading(false);
      } else {
        const [donationsRes, requestsRes] = await Promise.all([
          api.get('/donations'),
          api.get('/donations/requests/my')
        ]);
        setDonations(donationsRes.data);
        setMyRequests(requestsRes.data);
        setLoading(false);
      }
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      if (!err.response && user?.role === 'receiver') {
         setError("Could not connect. Showing demo data.");
         setDonations(FALLBACK_DONATIONS);
      } else {
        if (user?.role === 'donor') setDonations([]);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);


  const handleRequestDonation = async (id) => {
    if (id.startsWith("demo-")) return toast.info("Demo item cannot be requested.");
    if (!confirm("Request this donation?")) return;
    try {
      await api.post(`/donations/${id}/request`, { message: `Request from ${user.name}` });
      toast.success("Request sent!");
      fetchData(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!confirm("Are you sure you want to cancel this request?")) return;
    try {
      await api.delete(`/donations/requests/${requestId}/cancel`);
      toast.success("Request cancelled successfully");
      fetchData(); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!confirm("Delete this donation? This cannot be undone.")) return;
    try {
      await api.delete(`/donations/${id}`);
      toast.success("Donation deleted successfully");
      fetchData(); 
    } catch (error) {
      toast.error("Failed to delete donation");
    }
  };

  const handleViewDetails = (id) => {
    const donation = donations.find(d => d._id === id);
    if (donation) setSelectedDonation(donation);
  };

  const filteredDonations = donations.filter(d => 
    d.title?.toLowerCase().includes(search.toLowerCase()) || 
    d.foodType?.toLowerCase().includes(search.toLowerCase()) ||
    d.pickupLocation?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-24">
        
        {/* Improved Header Banner */}
        <div className="relative overflow-hidden bg-emerald-900 rounded-3xl p-8 mb-8 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2 opacity-80">
                <Badge variant="outline" className="border-white/30 text-white capitalize">
                  {user?.role} Account
                </Badge>
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}</h1>
              <p className="text-emerald-100 mt-1">
                {user?.role === 'donor' ? 'Thank you for making a difference today.' : 
                 user?.role === 'driver' ? 'Ready to deliver some happiness?' : 
                 'Find fresh food near you.'}
              </p>
            </div>
            {user?.role === 'donor' && (
              <Button onClick={() => setShowCreate(!showCreate)} className="bg-white text-emerald-900 hover:bg-emerald-50 border-none shadow-lg h-12 px-6 font-semibold">
                {showCreate ? <><X className="mr-2 h-4 w-4" /> Close Form</> : <><PlusCircle className="mr-2 h-4 w-4" /> Post Donation</>}
              </Button>
            )}
          </div>
          {/* Background decoration */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        </div>

        {/* Create Form */}
        {showCreate && user?.role === 'donor' && (
          <div className="mb-10 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 animate-in slide-in-from-top-4">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
              <Package className="h-5 w-5 text-emerald-600" /> Create New Donation
            </h2>
            <CreateDonationForm onSuccess={() => { setShowCreate(false); fetchData(); }} />
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Tabs - Improved Styling */}
        <Tabs defaultValue={getDefaultTab()} className="space-y-8">
          <div className="flex justify-center md:justify-start overflow-x-auto pb-2">
            <TabsList className="bg-white border p-1.5 shadow-sm rounded-full h-auto inline-flex gap-1">
              {user?.role !== 'driver' && <TabsTrigger value="overview" className="rounded-full px-4 py-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all">Overview</TabsTrigger>}
              {user?.role === 'donor' && <TabsTrigger value="donations" className="rounded-full px-4 py-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all">My Donations</TabsTrigger>}
              {user?.role === 'donor' && <TabsTrigger value="requests" className="rounded-full px-4 py-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all">Incoming Requests</TabsTrigger>}
              {user?.role === 'receiver' && <TabsTrigger value="my-requests" className="rounded-full px-4 py-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all">My Requests</TabsTrigger>}
              {user?.role === 'driver' && <TabsTrigger value="deliveries" className="rounded-full px-4 py-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all">Deliveries</TabsTrigger>}
              <TabsTrigger value="map" className="rounded-full px-4 py-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white transition-all">Live Map</TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Overview */}
          <TabsContent value="overview" className="space-y-6 animate-in fade-in duration-500">
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search food, location..." className="pl-10 h-11 bg-white border-gray-200" value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <Button variant="outline" className="h-11 bg-white"><Filter className="h-4 w-4 mr-2" /> Filters</Button>
            </div>

            {loading ? <div className="text-center py-20 text-gray-400">Loading...</div> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonations.length > 0 ? (
                  filteredDonations.map(d => (
                    <DonationCard key={d._id} donation={d} userType={user.role} onRequest={handleRequestDonation} onView={handleViewDetails} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <p className="text-gray-500 text-lg">No donations found.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Tab 2: My Donations */}
          <TabsContent value="donations" className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonations.length > 0 ? (
                filteredDonations.map(d => (
                  <DonationCard key={d._id} donation={d} userType={user.role} onView={handleViewDetails} onDelete={handleDeleteDonation} />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white border border-gray-100 rounded-2xl shadow-sm">
                  <p className="text-gray-500 mb-4">You haven't posted any donations yet.</p>
                  <Button variant="link" onClick={() => setShowCreate(true)} className="text-emerald-600 font-semibold">Post your first donation</Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Tab 3: My Requests */}
          <TabsContent value="my-requests" className="space-y-4 animate-in fade-in duration-500">
            {myRequests.length === 0 ? (
              <div className="py-20 text-center bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-500">
                You haven't made any requests yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {myRequests.map((req) => (
                  <Card key={req._id} className="border-none shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                    <div className={`h-1.5 w-full ${req.status === 'Pending' ? 'bg-amber-400' : req.status === 'Approved' ? 'bg-emerald-500' : 'bg-gray-300'}`}></div>
                    <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">{req.donation?.title || "Unknown Item"}</h3>
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md"><Calendar className="h-3 w-3" /> {format(new Date(req.createdAt), "MMM d, yyyy")}</span>
                          <Badge className={`${req.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'} hover:bg-opacity-80`}>
                            {req.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">Donor: {req.donor?.name || "Unknown"}</p>
                      </div>
                      
                      {(req.status === 'Pending' || req.status === 'Approved') && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleCancelRequest(req._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Cancel
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests"><RequestManagement /></TabsContent>
          <TabsContent value="deliveries"><DeliveryTracker /></TabsContent>
          <TabsContent value="map">
            <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-gray-200 shadow-xl relative bg-gray-100">
               <DonationsMap />
            </div>
          </TabsContent>
        </Tabs>

        {selectedDonation && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="relative h-72 bg-gray-100 group">
                {selectedDonation.image ? (
                  <img src={selectedDonation.image} alt={selectedDonation.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                    <ImageOff className="h-16 w-16 mb-3 opacity-20" />
                    <span>No Preview</span>
                  </div>
                )}
                
                {selectedDonation.image && <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />}
                
                <button onClick={() => setSelectedDonation(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white rounded-full transition-colors"><X className="h-5 w-5" /></button>
                
                <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                   <Badge className="bg-emerald-500 mb-2 border-none">{selectedDonation.foodType}</Badge>
                   <h2 className={`text-3xl font-bold ${!selectedDonation.image ? 'text-gray-900' : 'text-white'}`}>{selectedDonation.title}</h2>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-5 rounded-2xl space-y-2">
                    <h3 className="font-bold flex gap-2 text-gray-900"><Package className="h-5 w-5 text-emerald-600" /> Details</h3>
                    <p className="text-sm text-gray-600 pl-7">Quantity: <span className="font-semibold text-gray-900">{selectedDonation.quantity}</span></p>
                    <p className="text-sm text-gray-600 pl-7">Type: <span className="font-semibold text-gray-900">{selectedDonation.foodType}</span></p>
                  </div>
                  <div className="bg-emerald-50 p-5 rounded-2xl space-y-2 border border-emerald-100">
                    <h3 className="font-bold flex gap-2 text-emerald-900"><MapPin className="h-5 w-5 text-emerald-600" /> Location</h3>
                    <p className="text-sm text-emerald-800 pl-7">{selectedDonation.pickupLocation}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                   <h3 className="font-bold text-gray-900">Description</h3>
                   <p className="text-gray-600 leading-relaxed">{selectedDonation.description}</p>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setSelectedDonation(null)}>Close</Button>
                  {user?.role === 'receiver' && selectedDonation.status === 'Available' && (
                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12 rounded-xl shadow-lg shadow-emerald-200" onClick={() => { handleRequestDonation(selectedDonation._id); setSelectedDonation(null); }}>Request Donation</Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;