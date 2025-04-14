import React, { useState, useEffect, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const LocationTracker = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [vendorLocation, setVendorLocation] = useState(null);
  const [requestCompleted, setRequestCompleted] = useState(false);

  // Calculate distance between two points using Haversine formula
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  }, []);

  // Track user location
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation not available");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      position => {
        const newLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(newLoc);
      },
      error => console.error("Error getting location:", error),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Simulate vendor movement towards user
  useEffect(() => {
    if (!userLocation || requestCompleted) return;

    const interval = setInterval(() => {
      setVendorLocation(prev => {
        if (!prev) return userLocation;
        
        // Calculate direction towards user
        const latDelta = (userLocation.lat - prev.lat) * 0.3;
        const lngDelta = (userLocation.lng - prev.lng) * 0.3;

        // Check arrival (within 50 meters)
        const distance = calculateDistance(
          prev.lat, prev.lng,
          userLocation.lat, userLocation.lng
        );

        if (distance < 50) {
          setRequestCompleted(true);
          clearInterval(interval);
          return prev;
        }

        return {
          lat: prev.lat + latDelta,
          lng: prev.lng + lngDelta
        };
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [userLocation, calculateDistance, requestCompleted]);

  return (
    <div className="mt-10 min-h-screen w-full bg-gray-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 bg-green-600 text-white">
          <h2 className="text-lg font-semibold">Live Collection Tracking</h2>
          <p className="text-sm opacity-80">Track the WasteWise Collector on the way to your location</p>
        </div>
  
        {/* Map Section */}
        <div className="relative h-[500px] w-full">
          {userLocation ? (
            <MapContainer 
              center={[userLocation.lat, userLocation.lng]} 
              zoom={15}
              className="h-full w-full z-0 rounded-b-2xl"
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <Marker position={[userLocation.lat, userLocation.lng]}>
                <Popup className="font-semibold text-green-600">
                  Your Location
                </Popup>
              </Marker>
  
              {vendorLocation && (
                <Marker position={[vendorLocation.lat, vendorLocation.lng]}>
                  <Popup className="font-semibold text-blue-600">
                    WasteWise Collector
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <p className="text-lg text-gray-600 animate-pulse">
                Fetching your location...
              </p>
            </div>
          )}
  
          {requestCompleted && (
            <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-xl shadow-md border border-green-200">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                <h3 className="text-md font-semibold text-green-700">
                  Collection Completed!
                </h3>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                The collector has reached your location.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
};

export default LocationTracker;