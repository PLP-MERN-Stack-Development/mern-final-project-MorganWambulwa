import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // Use your new Axios instance
import { useAuth } from "../context/AuthContext";
import DonationCard from "./DonationCard";
import DonationsFilter from "./DonationsFilter";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { addDays, isBefore, startOfDay, endOfDay } from "date-fns";

// Calculate distance between two coordinates in km (Haversine formula)
const calculateDistance = (lat1, lng1, lat2, lng2) => {
  if (lat2 === null || lng2 === null || lat2 === undefined || lng2 === undefined) return null;
  
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const DonationsList = ({ userType, filterByUser = false }) => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchQuery: "",
    foodType: "",
    expiryFilter: "all",
    maxDistance: null,
    userLocation: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchDonations();
  }, [filterByUser]);

  const fetchDonations = async () => {
    setLoading(true);
    try {
      // Determine endpoint based on view type
      // If filterByUser is true, we fetch the logged-in user's donations
      // Otherwise, we fetch all available donations (for receivers)
      const endpoint = filterByUser ? '/donations/my' : '/donations';
      
      const { data } = await api.get(endpoint);
      setDonations(data || []);
    } catch (error) {
      console.error("Error fetching donations:", error);
      toast.error("Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  // Filter donations based on filter values
  const filteredDonations = useMemo(() => {
    return donations.filter((donation) => {
      // Search filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesSearch =
          donation.title?.toLowerCase().includes(query) ||
          donation.description?.toLowerCase().includes(query) ||
          donation.foodType?.toLowerCase().includes(query) ||
          donation.pickupLocation?.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Food type filter
      if (filters.foodType && donation.foodType !== filters.foodType) {
        return false;
      }

      // Expiry filter
      if (filters.expiryFilter !== "all" && donation.bestBefore) {
        const expiryDate = new Date(donation.bestBefore);
        const today = startOfDay(new Date());

        switch (filters.expiryFilter) {
          case "today":
            if (!isBefore(expiryDate, endOfDay(today))) return false;
            break;
          case "3days":
            if (!isBefore(expiryDate, endOfDay(addDays(today, 3)))) return false;
            break;
          case "week":
            if (!isBefore(expiryDate, endOfDay(addDays(today, 7)))) return false;
            break;
        }
      }

      // Distance filter
      if (filters.maxDistance && filters.userLocation) {
        // Mongo stores location as [lng, lat] in coordinates array
        const donationLat = donation.location?.coordinates?.[1];
        const donationLng = donation.location?.coordinates?.[0];

        const distance = calculateDistance(
          filters.userLocation.lat,
          filters.userLocation.lng,
          donationLat,
          donationLng
        );
        if (distance === null || distance > filters.maxDistance) return false;
      }

      return true;
    });
  }, [donations, filters]);

  const handleRequest = async (donationId) => {
    try {
      // Call the endpoint created in donationController: router.post('/:id/request', ...)
      await api.post(`/donations/${donationId}/request`);

      toast.success("Request sent successfully!");
      
      // Refresh list to update status UI
      fetchDonations();
    } catch (error) {
      console.error("Error requesting donation:", error);
      toast.error(error.response?.data?.message || "Failed to send request");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      {!filterByUser && <DonationsFilter onFilterChange={setFilters} />}
      
      {filteredDonations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {filterByUser
              ? "You haven't posted any donations yet."
              : filters.searchQuery || filters.foodType || filters.expiryFilter !== "all" || filters.maxDistance
              ? "No donations match your filters."
              : "No donations available at the moment."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((donation) => (
            <DonationCard
              key={donation._id}
              donation={donation}
              userType={userType}
              onRequest={handleRequest}
              onView={(id) => navigate(`/donation/${id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationsList;