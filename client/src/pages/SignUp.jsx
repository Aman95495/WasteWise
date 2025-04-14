import React from "react";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formdata, setFormData] = React.useState({});
  const [userType, setUserType] = React.useState("user"); // Add user type state
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.id]: e.target.value });
  };

  // Handle user type change
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Determine endpoint based on user type
      const endpoint =
        userType === "vendor"
          ? "/backend/auth/vendor/signup"
          : "/backend/auth/signup";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setError(null);
      
      navigate("/login");
    } catch (error) {
      setError("An error occurred. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 mt-10">
      <div className="w-full max-w-md mx-auto my-auto bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Sign Up</h2>
          <p className="text-sm text-gray-500">
            Create an account to get started
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
              required
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
          {/* Username Input */}
          <div className="mb-4">
            <input
              type="text"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
              required
              onChange={handleChange}
              id="username"
            />
          </div>

          {/* Email Input if userType is vendor it should be optional*/}
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              required={userType === "user"}
              onChange={handleChange}
              id="email"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              required
              onChange={handleChange}
              id="password"
            />
          </div>

          {/* Add vendor-specific fields if needed */}
          {userType === "vendor" && (
            <div className="mb-4">
              <input
                type="tel"
                className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone number"
                required
                onChange={handleChange}
                id="phone"
              />
            </div>
          )}

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" className="ml-1 mr-2" />
              Remember me
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline mr-1">
              Forgot password?
            </a>
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-80"
          >
            {loading ? "Loading..." : "Sign Up"}
          </button>
        </form>

        {error && <div className="mt-2 text-red-500">{error}</div>}

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-sm text-gray-400">Or continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <OAuth />

        <div className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log in here
          </a>
        </div>
      </div>
    </div>
  );
}
