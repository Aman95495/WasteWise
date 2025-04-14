import React from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function Login() {
  const [formData, setFormData] = React.useState({});
  const [userType, setUserType] = React.useState("user");
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    // Reset form data when switching types
    setFormData({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      // Determine the endpoint based on userType
      const endpoint =
        userType === "vendor"
          ? "/backend/auth/vendor/login"
          : "/backend/auth/login";

      // Base body for login request
      let body =
        userType === "vendor"
          ? {
              email: formData.email ? formData.email : "",
              phone: formData.phone ? formData.phone : "",
              password: formData.password,
            }
          : {
              email: formData.email,
              password: formData.password,
            };

      // If userType is vendor, attempt to get location
      if (userType === "vendor") {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000, // Optional: timeout after 10 seconds
            });
          });

          const { latitude, longitude } = position.coords;
          body.location = {
            type: "Point",
            coordinates: [longitude, latitude], // [lng, lat]
          };
        } catch (geoError) {
          console.warn("Geolocation unavailable:", geoError.message);
          // Proceed without location if geolocation fails or is denied
        }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (data.success === false) {
        dispatch(loginFailure(data.message));
        return;
      }

      dispatch(loginSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(loginFailure("An error occurred. Please try again later."));
    }
  };


  return (
    <div className="flex min-h-screen bg-gray-100 mt-10">
      <div className="w-full max-w-md mx-auto my-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Log In</h2>
          <p className="text-sm text-gray-500">
            Welcome back! Please log in to continue
          </p>
        </div>

        {/* User Type Selection */}
        <div className="mb-4 flex gap-4 justify-center">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="userType"
              value="user"
              checked={userType === "user"}
              onChange={handleUserTypeChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="text-gray-700">User</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="userType"
              value="vendor"
              checked={userType === "vendor"}
              onChange={handleUserTypeChange}
              className="form-radio h-4 w-4 text-blue-600"
            />
            <span className="text-gray-700">Vendor</span>
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          {userType === "vendor" ? (
            /* Vendor Login Fields */
            <div className="mb-3">
              <input
                type="tel"
                className="w-full px-4 py-2 mt-1 mb-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your phone number"
                onChange={handleChange}
                id="phone"
                name="phone"
              />
              <input
                type="email"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                onChange={handleChange}
                id="email"
                name="email"
              />
            </div>
          ) : (
            /* User Login Fields */
            <div className="mb-5">
              <input
                type="email"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
                required
                onChange={handleChange}
                id="email"
              />
            </div>
          )}

          {/* Password Input */}
          <div className="mb-5">
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
              onChange={handleChange}
              id="password"
            />
          </div>

          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300">
            {loading ? "Loading..." : "Log In"}
          </button>

          {error && <div className="text-red-500 mt-2">{error}</div>}
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm text-gray-400">Or continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <OAuth />

        <div className="text-center mt-6 text-sm text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </a>
        </div>
      </div>
    </div>
  );
}
