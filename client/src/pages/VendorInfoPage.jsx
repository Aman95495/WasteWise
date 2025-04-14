import { useParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaTruck } from "react-icons/fa";
import { useSelector } from "react-redux";

const VendorInfoPage = () => {
  const { id } = useParams();
  const { currentUser } = useSelector(state => state.user);
  const [vendor, setVendor] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchVendor = async () => {
      try {
        const response = await fetch(`/backend/vendor/${id}`);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch vendor');
        setVendor(data);
      } catch (error) {
        console.error("Error fetching vendor:", error);
        setError(error.message);
      }
    };
    fetchVendor();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!currentUser?.location) {
      setError("Please set your location in your profile");
      return;
    }

    try {
      // Get user coordinates
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const coordinates = [
        position.coords.longitude,
        position.coords.latitude
      ];

      const res = await fetch('/backend/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          user: currentUser._id,
          vendor: id,
          materialType: selectedMaterial,
          quantity: parseFloat(quantity),
          pickupAddress: currentUser.location,
          pickupCoordinates: coordinates
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to schedule pickup');

      setSuccess('Pickup scheduled successfully!');
      setSelectedMaterial("");
      setQuantity("");
    } catch (error) {
      setError(error.message);
      console.error('Schedule pickup error:', error);
    }
  };

  if (!vendor) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Vendor Info Section */}
        <img
          src={vendor.avatar}
          alt={vendor.companyName}
          className="w-16 h-16 rounded-full object-cover"
        />
        <h2 className="text-2xl font-bold mb-4">{vendor.username}</h2>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="flex items-center gap-2 mb-2">
              <FaMapMarkerAlt /> {vendor.areasCovered.join(", ")}
            </p>
            <p className="flex items-center gap-2">
              <FaTruck /> {vendor.vehicleType}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Accepted Materials:</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(vendor.pricePerKg).map(([material, price]) => (
                <span key={material} className="px-2 py-1 bg-green-100 rounded">
                  {material.charAt(0).toUpperCase() + material.slice(1)} - ₹
                  {price}/kg
                </span>
              ))}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Schedule Pickup</h3>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}

          <div className="grid md:grid-cols-2 gap-4">
            <select
              value={selectedMaterial}
              onChange={(e) => setSelectedMaterial(e.target.value)}
              className="border p-2 rounded"
              required
            >
              <option value="">Select Material</option>
              {Object.keys(vendor.pricePerKg).map((material) => (
                <option key={material} value={material}>
                  {material.charAt(0).toUpperCase() + material.slice(1)}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Quantity (kg)"
              min="0.1"
              step="0.1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="border p-2 rounded"
              required
            />
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <p>Pickup Address: {currentUser?.location || "No address set"}</p>
          </div>

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <FaCheckCircle className="inline mr-2" /> Schedule Pickup
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorInfoPage;