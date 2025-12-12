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
  Plus, 
  Search, 
  SlidersHorizontal, 
  X, 
  Package, 
  AlertCircle, 
  ArrowLeft,
  LayoutGrid,
  Map as MapIcon,
  List,
  TrendingUp,
  Clock,
  CheckCircle2,
  ImageOff,
  MapPin,
  Calendar,
  Trash2
} from "lucide-react";
import api from "@/api/axios";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const FALLBACK_DONATIONS = [
  { _id: "demo-1", title: "Demo Vegetables", foodType: "Vegetables", quantity: "15kg", pickupLocation: "Nairobi", status: "Available", donor: { name: "Demo User" } }
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [showCreate, setShowCreate] = useState(false);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid"); 
  
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
         setError("Connection failed. Showing demo data.");
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
    if (!confirm("Cancel this request?")) return;
    try {
      await api.delete(`/donations/requests/${requestId}/cancel`);
      toast.success("Request cancelled");
      fetchData(); 
    } catch (err) {
      toast.error("Failed to cancel");
    }
  };

  const handleDeleteDonation = async (id) => {
    if (!confirm("Delete this donation?")) return;
    try {
      await api.delete(`/donations/${id}`);
      toast.success("Donation deleted");
      fetchData(); 
    } catch (error) {
      toast.error("Failed to delete");
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

  // Dynamic Stats Calculation
  const activeCount = donations.filter(d => d.status === 'Available').length;
  const completedCount = donations.filter(d => d.status === 'Delivered' || d.status === 'Completed').length;
  const totalCount = donations.length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider border border-orange-200">
                {user?.role} Dashboard
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Hello, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-slate-500 mt-2 text-lg">
              {user?.role === 'donor' ? "Manage your contributions and track impact." : "Explore available food and make requests."}
            </p>
          </div>

          <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm min-w-[140px] flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Package className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{totalCount}</p>
                <p className="text-xs text-slate-500 font-medium uppercase">Total Items</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm min-w-[140px] flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><CheckCircle2 className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{activeCount}</p>
                <p className="text-xs text-slate-500 font-medium uppercase">Active</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm min-w-[140px] flex items-center gap-3">
              <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><TrendingUp className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{completedCount}</p>
                <p className="text-xs text-slate-500 font-medium uppercase">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        <Tabs defaultValue={getDefaultTab()} className="space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm sticky top-20 z-30">
            <TabsList className="bg-slate-100/50 p-1 rounded-xl h-auto flex-wrap justify-start w-full md:w-auto">
              {user?.role !== 'driver' && <TabsTrigger value="overview" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all">Overview</TabsTrigger>}
              {user?.role === 'donor' && <TabsTrigger value="donations" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all">My Donations</TabsTrigger>}
              {user?.role === 'donor' && <TabsTrigger value="requests" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all">Requests</TabsTrigger>}
              {user?.role === 'receiver' && <TabsTrigger value="my-requests" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all">My Requests</TabsTrigger>}
              {user?.role === 'driver' && <TabsTrigger value="deliveries" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all">Deliveries</TabsTrigger>}
              <TabsTrigger value="map" className="rounded-lg px-4 py-2 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-sm transition-all">Live Map</TabsTrigger>
            </TabsList>

            {user?.role === 'donor' && (
              <Button onClick={() => setShowCreate(true)} className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-lg shadow-slate-200 px-6">
                <Plus className="h-4 w-4 mr-2" /> Post Donation
              </Button>
            )}
          </div>

          {showCreate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
              <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Post New Donation</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowCreate(false)} className="rounded-full hover:bg-slate-100">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <CreateDonationForm onSuccess={() => { setShowCreate(false); fetchData(); }} />
              </div>
            </div>
          )}

          
          <TabsContent value="overview" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input 
                  placeholder="Search food types, locations..." 
                  className="pl-10 h-11 bg-white border-slate-200 rounded-xl focus:ring-emerald-500"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Button variant="outline" className="h-11 rounded-xl border-slate-200 bg-white">
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Filter
              </Button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => <div key={i} className="h-80 bg-slate-100 rounded-3xl animate-pulse"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDonations.length > 0 ? (
                  filteredDonations.map(d => (
                    <DonationCard key={d._id} donation={d} userType={user.role} onRequest={handleRequestDonation} onView={handleViewDetails} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center bg-white border border-dashed border-slate-200 rounded-3xl">
                    <p className="text-slate-500">No donations found matching your search.</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="donations" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDonations.map(d => (
                <DonationCard key={d._id} donation={d} userType={user.role} onView={handleViewDetails} onDelete={handleDeleteDonation} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-requests" className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {myRequests.length === 0 ? (
              <div className="py-20 text-center text-slate-500 bg-white rounded-3xl border border-dashed border-slate-200">
                You haven't requested anything yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {myRequests.map((req) => (
                  <Card key={req._id} className="border border-slate-100 shadow-sm hover:shadow-md transition-all rounded-2xl overflow-hidden group">
                    <CardContent className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-slate-50 text-slate-500 rounded-xl group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors">
                          <Package className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{req.donation?.title || "Unknown Item"}</h3>
                          <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {format(new Date(req.createdAt), "MMM d")}</span>
                            <span>•</span>
                            <span>Donor: {req.donor?.name || "Unknown"}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <Badge className={`px-3 py-1 ${req.status === 'Pending' ? 'bg-orange-100 text-orange-700 hover:bg-orange-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'} border-none`}>
                          {req.status}
                        </Badge>
                        {(req.status === 'Pending' || req.status === 'Approved') && (
                          <Button variant="ghost" size="sm" onClick={() => handleCancelRequest(req._id)} className="text-red-500 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4 mr-2" /> Cancel
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="requests"><RequestManagement /></TabsContent>
          <TabsContent value="deliveries"><DeliveryTracker /></TabsContent>
          <TabsContent value="map">
            <div className="h-[700px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative bg-slate-100">
               <DonationsMap />
            </div>
          </TabsContent>
        </Tabs>

        {selectedDonation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
              <div className="relative h-72 bg-slate-100 group">
                {selectedDonation.image ? (
                  <img src={selectedDonation.image} alt={selectedDonation.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                    <ImageOff className="h-16 w-16 mb-3 opacity-20" />
                    <span>No Preview</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                <button onClick={() => setSelectedDonation(null)} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white rounded-full transition-colors"><X className="h-5 w-5" /></button>
                <div className="absolute bottom-0 left-0 w-full p-8 text-white">
                   <Badge className="bg-emerald-500 mb-2 border-none px-3 py-1">{selectedDonation.foodType}</Badge>
                   <h2 className="text-3xl font-bold leading-tight">{selectedDonation.title}</h2>
                </div>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-slate-50 p-5 rounded-2xl">
                    <h3 className="font-bold flex items-center gap-2 text-slate-900 mb-2"><Package className="h-5 w-5 text-emerald-600" /> Donation Details</h3>
                    <p className="text-sm text-slate-600 pl-7">Quantity: <span className="font-semibold text-slate-900">{selectedDonation.quantity}</span></p>
                    <p className="text-sm text-slate-600 pl-7">Expiry: <span className="font-semibold text-slate-900">{selectedDonation.bestBefore ? format(new Date(selectedDonation.bestBefore), "MMM d") : "N/A"}</span></p>
                  </div>
                  <div className="bg-orange-50/50 p-5 rounded-2xl">
                    <h3 className="font-bold flex items-center gap-2 text-slate-900 mb-2"><MapPin className="h-5 w-5 text-orange-500" /> Pickup Location</h3>
                    <p className="text-sm text-slate-600 pl-7 font-medium">{selectedDonation.pickupLocation}</p>
                  </div>
                </div>
                <div>
                   <h3 className="font-bold text-slate-900 mb-2">Description</h3>
                   <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl">{selectedDonation.description || "No additional details provided."}</p>
                </div>
                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <Button variant="outline" className="flex-1 h-12 rounded-xl border-slate-300 font-semibold" onClick={() => setSelectedDonation(null)}>Close</Button>
                  {user?.role === 'receiver' && selectedDonation.status === 'Available' && (
                    <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white h-12 rounded-xl shadow-lg font-bold" onClick={() => { handleRequestDonation(selectedDonation._id); setSelectedDonation(null); }}>Request Donation</Button>
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