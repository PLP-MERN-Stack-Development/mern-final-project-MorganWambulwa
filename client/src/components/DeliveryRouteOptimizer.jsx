import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import api from "../api/axios"; // Use your new Axios instance
import { toast } from "sonner";
import { 
  Loader2, 
  MapPin, 
  Navigation, 
  Route, 
  Clock, 
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DeliveryRouteOptimizer = ({ deliveries }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [mapboxToken, setMapboxToken] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [optimizedRoute, setOptimizedRoute] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);

  // Extract all stops from deliveries
  const extractStops = () => {
    const stops = [];
    
    deliveries.forEach((delivery) => {
      if (delivery.donation) {
        // Add pickup stop
        stops.push({
          id: `pickup-${delivery._id}`, // Adjusted to MongoDB _id
          type: "pickup",
          donationTitle: delivery.donation.title,
          address: delivery.donation.pickupLocation, // Adjusted naming
          lat: delivery.donation.location?.coordinates?.[1] || null, // Adjusted for GeoJSON
          lng: delivery.donation.location?.coordinates?.[0] || null,
          contactName: delivery.donor?.name || "Donor",
          contactPhone: delivery.donor?.phone || null,
          deliveryId: delivery._id,
        });

        // Add dropoff stop (if assigned to a receiver)
        if (delivery.receiver) {
          stops.push({
            id: `dropoff-${delivery._id}`,
            type: "dropoff",
            donationTitle: delivery.donation.title,
            address: delivery.receiver.address || "Address not specified",
            // Assuming receiver has location data, otherwise null
            lat: delivery.receiver.location?.coordinates?.[1] || null, 
            lng: delivery.receiver.location?.coordinates?.[0] || null,
            contactName: delivery.receiver.name,
            contactPhone: delivery.receiver.phone || null,
            deliveryId: delivery._id,
          });
        }
      }
    });

    return stops;
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
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

  // Nearest neighbor algorithm for route optimization
  const optimizeRoute = (stops, startLat, startLng) => {
    const stopsWithCoords = stops.filter((s) => s.lat !== null && s.lng !== null);
    if (stopsWithCoords.length === 0) return stops;

    const optimized = [];
    const remaining = [...stopsWithCoords];
    let currentLat = startLat;
    let currentLng = startLng;

    // Track which deliveries have been picked up
    const pickedUp = new Set();

    while (remaining.length > 0) {
      let nearestIndex = -1;
      let nearestDistance = Infinity;

      remaining.forEach((stop, index) => {
        // Can only do dropoff if pickup is done (simplified logic)
        // Note: For strict pickup->dropoff enforcement, we check IDs
        if (stop.type === "dropoff" && !pickedUp.has(stop.deliveryId)) {
          return;
        }

        const distance = calculateDistance(currentLat, currentLng, stop.lat, stop.lng);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      if (nearestIndex === -1) {
        // If we have remaining stops but can't reach them (e.g. orphan dropoffs), force add them to clear queue
        // In a real app, you might handle this differently
        if (remaining.length > 0) {
             const forcedStop = remaining[0];
             optimized.push(forcedStop);
             remaining.splice(0, 1);
        }
        break;
      };

      const nearestStop = remaining[nearestIndex];
      optimized.push(nearestStop);
      
      if (nearestStop.type === "pickup") {
        pickedUp.add(nearestStop.deliveryId);
      }

      currentLat = nearestStop.lat;
      currentLng = nearestStop.lng;
      remaining.splice(nearestIndex, 1);
    }

    // Add stops without coordinates at the end
    const stopsWithoutCoords = stops.filter((s) => s.lat === null || s.lng === null);
    return [...optimized, ...stopsWithoutCoords];
  };

  // Calculate total route distance and estimated time
  const calculateRouteMetrics = (route, startLat, startLng) => {
    let distance = 0;
    let prevLat = startLat;
    let prevLng = startLng;

    route.forEach((stop) => {
      if (stop.lat && stop.lng) {
        distance += calculateDistance(prevLat, prevLng, stop.lat, stop.lng);
        prevLat = stop.lat;
        prevLng = stop.lng;
      }
    });

    setTotalDistance(Math.round(distance * 10) / 10);
    // Estimate 3 min per km + 5 min per stop
    setEstimatedTime(Math.round(distance * 3 + route.length * 5));
  };

  // Fetch Mapbox token from your new Backend
  useEffect(() => {
    const fetchToken = async () => {
      try {
        // You need to create this endpoint in your backend server/routes/config.js or similar
        // Or temporarily hardcode it: setMapboxToken("pk.eyJ1I...")
        const { data } = await api.get("/config/mapbox-token");
        if (data?.token) {
          setMapboxToken(data.token);
        } else {
          throw new Error("No token received");
        }
      } catch (error) {
        console.error("Error fetching Mapbox token:", error);
        // Fallback for dev if needed
        // setMapboxToken("YOUR_HARDCODED_TOKEN_HERE"); 
        toast.error("Failed to load map configuration");
        setLoading(false);
      }
    };
    fetchToken();
  }, []);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.longitude, position.coords.latitude]);
        },
        () => {
          setUserLocation([36.8219, -1.2921]); // Default to Nairobi
        }
      );
    } else {
      setUserLocation([36.8219, -1.2921]);
    }
  }, []);

  // Optimize route when deliveries or location changes
  useEffect(() => {
    if (!userLocation || !deliveries) return;
    
    const stops = extractStops();
    const optimized = optimizeRoute(stops, userLocation[1], userLocation[0]);
    setOptimizedRoute(optimized);
    calculateRouteMetrics(optimized, userLocation[1], userLocation[0]);
  }, [deliveries, userLocation]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || !userLocation) return;

    mapboxgl.accessToken = mapboxToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: userLocation,
      zoom: 12,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    map.current.on("load", () => {
      setLoading(false);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken, userLocation]);

  // Add route markers and line
  useEffect(() => {
    if (!map.current || loading || optimizedRoute.length === 0) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Remove existing route layer
    if (map.current.getSource("route")) {
      map.current.removeLayer("route");
      map.current.removeSource("route");
    }

    const coordinates = [];
    
    // Add user location as start
    if (userLocation) {
      coordinates.push(userLocation);
      
      const startEl = document.createElement("div");
      startEl.innerHTML = `
        <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
      `;

      const startMarker = new mapboxgl.Marker(startEl)
        .setLngLat(userLocation)
        .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML("<strong>Your Location</strong>"))
        .addTo(map.current);
      markersRef.current.push(startMarker);
    }

    // Add markers for each stop
    optimizedRoute.forEach((stop, index) => {
      if (stop.lat && stop.lng) {
        coordinates.push([stop.lng, stop.lat]);

        const el = document.createElement("div");
        const bgColor = stop.type === "pickup" ? "bg-amber-500" : "bg-emerald-500";
        const icon = stop.type === "pickup" 
          ? `<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>`
          : `<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>`;
        
        el.innerHTML = `
          <div class="relative">
            <div class="w-10 h-10 ${bgColor} rounded-full flex items-center justify-center shadow-lg border-2 border-white cursor-pointer transform transition-transform hover:scale-110">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                ${icon}
              </svg>
            </div>
            <div class="absolute -top-2 -right-2 w-6 h-6 bg-foreground text-background rounded-full flex items-center justify-center text-xs font-bold">
              ${index + 1}
            </div>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
          <div class="p-3 min-w-[220px]">
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-0.5 rounded text-xs font-medium ${
                stop.type === "pickup" 
                  ? "bg-amber-100 text-amber-800" 
                  : "bg-emerald-100 text-emerald-800"
              }">
                ${stop.type === "pickup" ? "Pickup" : "Dropoff"}
              </span>
              <span class="text-xs text-gray-500">Stop #${index + 1}</span>
            </div>
            <h3 class="font-semibold text-sm">${stop.donationTitle}</h3>
            <p class="text-xs text-gray-600 mt-1">${stop.contactName}</p>
            ${stop.contactPhone ? `<p class="text-xs text-gray-500">${stop.contactPhone}</p>` : ""}
            <p class="text-xs text-gray-500 mt-1 line-clamp-2">${stop.address}</p>
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([stop.lng, stop.lat])
          .setPopup(popup)
          .addTo(map.current);
        markersRef.current.push(marker);
      }
    });

    // Add route line
    if (coordinates.length > 1) {
      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        },
      });

      map.current.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#10b981",
          "line-width": 4,
          "line-dasharray": [2, 1],
        },
      });
    }

    // Fit bounds
    if (coordinates.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord) => bounds.extend(coord));
      map.current.fitBounds(bounds, { padding: 60, maxZoom: 14 });
    }
  }, [optimizedRoute, loading, userLocation, mapboxToken]);

  const handleRecalculate = () => {
    if (!userLocation) return;
    const stops = extractStops();
    const optimized = optimizeRoute(stops, userLocation[1], userLocation[0]);
    setOptimizedRoute(optimized);
    calculateRouteMetrics(optimized, userLocation[1], userLocation[0]);
    toast.success("Route recalculated");
  };

  if (!deliveries || deliveries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Route className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground text-center">
            No active deliveries to optimize
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Route Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Route className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{optimizedRoute.length}</p>
              <p className="text-xs text-muted-foreground">Total Stops</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{totalDistance} km</p>
              <p className="text-xs text-muted-foreground">Total Distance</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{estimatedTime} min</p>
              <p className="text-xs text-muted-foreground">Est. Time</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <Button 
              variant="outline" 
              className="w-full h-full"
              onClick={handleRecalculate}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Recalculate
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Optimized Route Map
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 z-10 bg-background/80 flex items-center justify-center rounded-b-lg">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading map...</p>
                </div>
              </div>
            )}
            <div ref={mapContainer} className="h-[400px] rounded-b-lg" />
            
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-md space-y-2 z-20">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-foreground">Your Location</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <span className="text-foreground">Pickup Point</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <span className="text-foreground">Dropoff Point</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Route Steps */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Delivery Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Starting point */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0">
                S
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">Start: Your Current Location</p>
              </div>
            </div>

            {optimizedRoute.map((stop, index) => (
              <div key={stop.id}>
                <div className="flex items-center justify-center my-1">
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <div 
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    stop.type === "pickup" 
                      ? "bg-amber-50 dark:bg-amber-950/30" 
                      : "bg-emerald-50 dark:bg-emerald-950/30"
                  }`}
                >
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                      stop.type === "pickup" ? "bg-amber-500" : "bg-emerald-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${
                          stop.type === "pickup" 
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" 
                            : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                        }`}
                      >
                        {stop.type === "pickup" ? "Pickup" : "Dropoff"}
                      </Badge>
                      <span className="text-sm font-medium text-foreground truncate">
                        {stop.donationTitle}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{stop.contactName}</p>
                    <p className="text-xs text-muted-foreground truncate">{stop.address}</p>
                  </div>
                  {stop.contactPhone && (
                    <a 
                      href={`tel:${stop.contactPhone}`}
                      className="shrink-0 p-2 rounded-full bg-background hover:bg-muted transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliveryRouteOptimizer;