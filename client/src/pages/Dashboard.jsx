import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaTrash,
  FaCheck,
  FaClock,
  FaMapMarkerAlt,
  FaTruck,
  FaPhone,
  FaMoneyBillWave,
} from "react-icons/fa";
import LocationTracker from "./LocationTracker";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch(`/backend/requests/vendor/${currentUser._id}`);
        const data = await res.json();

        setRequests(data.requests);
        setStats({
          totalRequests: data.stats.total,
          pending: data.stats.pending,
          completed: data.stats.completed,
        });
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchRequests();
    }
  }, [currentUser]);

  const handleRequestAction = async (requestId, action) => {
    try {
      const res = await fetch(`/backend/requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, user: currentUser._id }),
      });
      const updatedRequest = await res.json();

      setRequests(
        requests.map((req) => (req._id === requestId ? updatedRequest : req))
      );
    } catch (error) {
      console.error("Failed to update request:", error);
    }
  };

  if (loading) {
    return <div className="mt-20 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="mt-20 max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar remains unchanged */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md h-fit">
          <div className="text-center mb-6">
            <img
              src={currentUser.avatar}
              alt="Vendor logo"
              className="w-24 h-24 rounded-full mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold">{currentUser.companyName}</h2>
            <p className="text-gray-600">{currentUser.username}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FaPhone className="text-green-600" />
              <span>{currentUser.phone}</span>
            </div>

            <div className="flex items-center gap-2">
              <FaTruck className="text-green-600" />
              <span>{currentUser.vehicleType}</span>
            </div>

            <div>
              <h3 className="font-medium mb-2">Service Areas</h3>
              <div className="flex flex-wrap gap-2">
                {currentUser.areasCovered.map((area) => (
                  <span
                    key={area}
                    className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Service Hours</h3>
              <p className="text-sm text-gray-600">
                {currentUser.serviceHours.start} -{" "}
                {currentUser.serviceHours.end}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Stats Cards*/}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <FaMoneyBillWave className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">
                    {stats.totalRequests}
                  </p>
                  <p className="text-gray-600">Total Requests</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FaClock className="text-yellow-600 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats.pending}</p>
                  <p className="text-gray-600">Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <FaCheck className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-semibold">{stats.completed}</p>
                  <p className="text-gray-600">Completed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Updated Requests List */}
          <div className="bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold p-6 border-b">
              Active Requests
            </h3>

            <div className="divide-y">
              {requests.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  No active requests found
                </div>
              ) : (
                requests.map((request) => (
                  <div key={request._id} className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FaMapMarkerAlt className="text-green-600" />
                          <span className="font-medium">
                            {request.pickupAddress}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                            {request.quantity}kg {request.materialType}
                          </span>
                          <span className="px-2 py-1 bg-blue-100 rounded-full text-sm">
                            ₹{request.pricePerKg}/kg
                          </span>
                          <span className="px-2 py-1 bg-green-100 rounded-full text-sm">
                            Total: ₹{request.totalPrice}
                          </span>
                        </div>

                        <p className="text-sm text-gray-600">
                          Requested at:{" "}
                          {new Date(request.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {request.status === "pending" ? (
                          <>
                            <Link to="/location-tracker">
                              <button
                                onClick={() =>
                                  handleRequestAction(request._id, "accept")
                                }
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                              >
                                <FaCheck />
                              </button>
                            </Link>
                            <button
                              onClick={() =>
                                handleRequestAction(request._id, "cancel")
                              }
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              <FaTrash />
                            </button>
                          </>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              request.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : request.status === "completed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {request.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
