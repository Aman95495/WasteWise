import React, { useEffect, useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaFilter, FaTruck } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function SearchVendors() {
  const [vendors, setVendors] = useState([]);
  const [filters, setFilters] = useState({
    material: "",
    vehicleType: "",
    serviceArea: "",
  });
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          setError("Please enable location access to find local vendors");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
    }
  }, []);

  // Fetch vendors based on location
  useEffect(() => {
    if (userLocation) {
      fetchVendors();
    }
  }, [userLocation]);

  const fetchVendors = async () => {
    try {
      const res = await fetch(
        `/backend/vendor/nearby?lat=${userLocation.lat}&lng=${userLocation.lng}`
      );

      if (!res.ok) {
        setError("Failed to load vendors");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setVendors(data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load vendors");
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const filteredVendors = vendors.filter((vendor) => {
    return (
      (!filters.material || vendor.pricePerKg[filters.material]) &&
      (!filters.vehicleType || vendor.vehicleType === filters.vehicleType) &&
      (!filters.serviceArea ||
        vendor.areasCovered.includes(filters.serviceArea))
    );
  });

  if (loading) {
    return <div className="mt-20 text-center">Loading vendors...</div>;
  }

  if (error) {
    return <div className="mt-20 text-center text-red-500">{error}</div>;
  }


  return (
    <div className="mt-20 max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full md:w-64 bg-white p-6 rounded-lg shadow-md h-fit">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FaFilter /> Filters
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Material</label>
              <select
                name="material"
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Materials</option>
                <option value="plastic">Plastic</option>
                <option value="metal">Metal</option>
                <option value="paper">Paper</option>
                <option value="glass">Glass</option>
                <option value="ewaste">E-Waste</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Vehicle Type
              </label>
              <select
                name="vehicleType"
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md"
              >
                <option value="">All Vehicles</option>
                <option value="Truck">Truck</option>
                <option value="Van">Van</option>
                <option value="Auto">Auto</option>
                <option value="Cycle">Cycle</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Service Area
              </label>
              <input
                type="text"
                name="serviceArea"
                placeholder="Enter area"
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
        </div>

        {/* Vendor List */}
        <div className="flex-1">
          <div className="mb-6 flex items-center gap-4 bg-white p-4 rounded-lg shadow-md">
            <FaSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search vendors by name or service..."
              className="flex-1 outline-none"
              // Add search functionality if needed
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredVendors.map((vendor) => (
              <div
                key={vendor._id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={vendor.avatar}
                    alt={vendor.username}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-xl font-semibold">
                      <Link
                        to={`/vendor/${vendor._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {vendor.username}
                      </Link>
                    </h3>
                    <p className="text-gray-600 flex items-center gap-1">
                      <FaMapMarkerAlt /> {vendor.areasCovered.join(", ")}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <FaTruck /> {vendor.vehicleType}
                  </p>
                  <p>☎️ {vendor.phone}</p>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Accepts:</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(vendor.pricePerKg).map(
                      ([material, price]) =>
                        price && (
                          <span
                            key={material}
                            className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                          >
                            {material.charAt(0).toUpperCase() +
                              material.slice(1)}
                            <span className="ml-1">₹{price}/kg</span>
                          </span>
                        )
                    )}
                  </div>
                </div>

                {vendor.serviceHours && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      Service Hours: {vendor.serviceHours.start} -{" "}
                      {vendor.serviceHours.end}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {filteredVendors.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No vendors found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
