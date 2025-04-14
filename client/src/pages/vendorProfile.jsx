import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCamera,
  FaEdit,
  FaEnvelope,
  FaLock,
  FaSave,
  FaTimes,
  FaTrash,
  FaMapMarkerAlt,
  FaClock,
  FaTruck,
  FaPhone,
} from "react-icons/fa";
import {
  UpdateUserStart,
  UpdateUserSuccess,
  UpdateUserFailure,
  DeleteUserFailure,
  DeleteUserStart,
  DeleteUserSuccess,
  SignOutUserStart,
  SignOutUserSuccess,
  SignOutUserFailure,
} from "../redux/user/userSlice";

export default function VendorProfile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [formData, setFormData] = useState({
    username: currentUser.username,
    email: currentUser.email || "",
    phone: currentUser.phone,
    areasCovered: currentUser.areasCovered || [],
    pricePerKg: {
      plastic: currentUser.pricePerKg?.plastic || "",
      metal: currentUser.pricePerKg?.metal || "",
      paper: currentUser.pricePerKg?.paper || "",
      glass: currentUser.pricePerKg?.glass || "",
      ewaste: currentUser.pricePerKg?.ewaste || "",
    },
    companyName: currentUser.companyName || "",
    vehicleType: currentUser.vehicleType || "",
    serviceHours: currentUser.serviceHours || { start: "", end: "" },
    certification: currentUser.certification || "",
    avatar: currentUser.avatar || "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || "");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isGoogleAuth, setIsGoogleAuth] = useState(
    currentUser?.authProvider === "google"
  );
  const [verificationStep, setVerificationStep] = useState(null);
  const [verificationCode, setVerificationCode] = useState("");

  useEffect(() => {
    if (avatarFile) {
      handleAvatarUpload(avatarFile);
    }
  }, [avatarFile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("pricePerKg.")) {
      const material = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        pricePerKg: { ...prev.pricePerKg, [material]: Number(value) },
      }));
    } else if (name.startsWith("serviceHours.")) {
      const timeType = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        serviceHours: { ...prev.serviceHours, [timeType]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAreasChange = (e) => {
    const areas = e.target.value.split(",").map((area) => area.trim());
    setFormData((prev) => ({ ...prev, areasCovered: areas }));
  };

  const handleAvatarUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

    try {
      const response = await fetch(import.meta.env.VITE_CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (data.secure_url) {
        setFormData((prev) => ({ ...prev, avatar: data.secure_url }));
        setAvatarUrl(data.secure_url);
      }
    } catch (error) {
      setMessage("Failed to upload avatar");
      setMessageType("error");
    }
  };

  const handleAvatarChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const updateProfile = async () => {
    try {
      dispatch(UpdateUserStart());
      console.log(currentUser._id);
      const res = await fetch(`/backend/vendor/update/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      dispatch(UpdateUserSuccess(data));
      setMessage("Profile updated successfully!");
      setMessageType("success");
      setIsEditing(false);
    } catch (error) {
      dispatch(UpdateUserFailure(error.message));
      setMessage(error.message);
      setMessageType("error");
    }
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    updateProfile();
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("Passwords don't match");
      setMessageType("error");
      return;
    }

    try {
      const body = {
        newPassword: passwordData.newPassword,
        ...(isGoogleAuth && { verificationCode }),
      };

      if (!isGoogleAuth) {
        body.currentPassword = passwordData.currentPassword;
      }

      body.confirmPassword = passwordData.confirmPassword;

      console.log(body);

      const res = await fetch(
        `/backend/vendor/update-password/${currentUser._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setMessage("Password updated successfully!");
      setMessageType("success");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setVerificationStep(null);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  const handleRequestVerificationCode = async () => {
    try {
      const res = await fetch("/backend/auth/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser.email }),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      setVerificationStep("verify");
      setMessage("Verification code sent to your email");
      setMessageType("success");
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    )
      return;

    try {
      dispatch(DeleteUserStart());
      const res = await fetch(`/backend/vendor/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      dispatch(DeleteUserSuccess());
      window.location.href = "/";
    } catch (error) {
      dispatch(DeleteUserFailure(error.message));
      setMessage(error.message);
      setMessageType("error");
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(SignOutUserStart());
      const res = await fetch("/backend/auth/logout", {
        method: "POST",
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.message);

      dispatch(SignOutUserSuccess());
      window.location.href = "/";
    } catch (error) {
      dispatch(SignOutUserFailure(error.message));
      setMessage(error.message);
      setMessageType("error");
    }
  };


  return (
    <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8 mt-10">
      <div className="max-w-3xl mx-auto">
        {message && (
          <div
            className={`mb-4 p-4 rounded-md ${
              messageType === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={avatarUrl || "/default-vendor-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer hover:bg-green-600">
                  <FaCamera />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800">
                {isEditing ? (
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="border-b-2 border-green-500 bg-transparent"
                  />
                ) : (
                  formData.username
                )}
              </h1>
              {formData.companyName && (
                <p className="text-gray-600 mt-2">
                  {isEditing ? (
                    <input
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="border-b-2 border-green-500 bg-transparent"
                    />
                  ) : (
                    formData.companyName
                  )}
                </p>
              )}
              <div className="mt-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto md:mx-0"
                  >
                    <FaEdit /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2 justify-center md:justify-start">
                    <button
                      onClick={handleProfileUpdate}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center gap-2"
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Service Details Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Service Details
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Areas Covered */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-green-600" />
                Areas Covered
              </label>
              {isEditing ? (
                <textarea
                  value={formData.areasCovered.join(", ")}
                  onChange={handleAreasChange}
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter areas separated by commas"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.areasCovered.map((area) => (
                    <span
                      key={area}
                      className="bg-green-100 px-2 py-1 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Pricing */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Kg (₹)
              </label>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-4">
                  {Object.keys(formData.pricePerKg).map((material) => (
                    <div key={material} className="flex items-center gap-2">
                      <span>
                        {material.charAt(0).toUpperCase() + material.slice(1)}
                      </span>
                      <input
                        type="number"
                        name={`pricePerKg.${material}`}
                        value={formData.pricePerKg[material] || ""}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md"
                        min="0"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {Object.entries(formData.pricePerKg).map(
                    ([material, price]) =>
                      price ? (
                        <span
                          key={material}
                          className="bg-green-100 px-2 py-1 rounded-full text-sm"
                        >
                          {material.charAt(0).toUpperCase() + material.slice(1)}
                          : ₹{price}
                        </span>
                      ) : null
                  )}
                  {Object.values(formData.pricePerKg).every(
                    (price) => !price
                  ) && <span className="text-gray-500">No pricing set</span>}
                </div>
              )}
            </div>

            {/* Service Hours */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaClock className="inline mr-2 text-green-600" />
                Service Hours
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="time"
                  name="serviceHours.start"
                  value={formData.serviceHours.start}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="p-1 border rounded-md"
                />
                <span>-</span>
                <input
                  type="time"
                  name="serviceHours.end"
                  value={formData.serviceHours.end}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="p-1 border rounded-md"
                />
              </div>
            </div>

            {/* Vehicle Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FaTruck className="inline mr-2 text-green-600" />
                Vehicle Type
              </label>
              {isEditing ? (
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Auto">Auto</option>
                  <option value="Cycle">Cycle</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <span>{formData.vehicleType}</span>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Contact Information
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <FaPhone className="text-green-600" />
              <input
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-transparent flex-1 p-1 border-b"
                placeholder="Phone number"
              />
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-green-600" />
              <input
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="bg-transparent flex-1 p-1 border-b"
                placeholder="Email address"
              />
            </div>
          </div>
          <div className="pt-6 border-t">
            <button
              type="button"
              onClick={() => setShowPasswordModal(true)}
              className="text-green-600 hover:text-green-700 flex items-center gap-2"
            >
              <FaLock /> Change Password
            </button>
          </div>
        </div>

        {/* Password Change Modal (Similar to user profile) */}
        {showPasswordModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Change Password
              </h3>

              {isGoogleAuth && verificationStep === null && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-4">
                    You signed up with Google. We'll send a verification code to
                    your email to change your password.
                  </p>
                  <button
                    onClick={handleRequestVerificationCode}
                    className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                  >
                    Send Verification Code
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(false)}
                    className="w-full mt-2 border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {(!isGoogleAuth || verificationStep === "verify") && (
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  {isGoogleAuth && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Verification Code
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  )}

                  {!isGoogleAuth && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full p-2 border rounded-md focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordModal(false);
                        setVerificationStep(null);
                      }}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Account Actions */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-red-600">
              Account Actions
            </h3>
            <div className="flex gap-4">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50"
              >
                Sign Out
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2"
              >
                <FaTrash /> Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
