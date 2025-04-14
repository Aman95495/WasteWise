import React from "react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCamera,
  FaEdit,
  FaEnvelope,
  FaLock,
  FaSave,
  FaTimes,
  FaUser,
  FaTrash,
  FaRecycle,
  FaMapMarkerAlt,
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
  SignOutUserFailure
} from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("");
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    location: currentUser?.location || "",
    recyclingPreferences: currentUser?.recyclingPreferences || [],
    avatar: currentUser?.avatar || "",
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

  const recyclingOptions = [
    'Plastic',
    'Glass',
    'Paper',
    'Metal',
    'E-Waste',
    'Organic',
    'Hazardous'
  ];

  useEffect(() => {
    if (avatarFile) handleAvatarUpload(avatarFile);
  }, [avatarFile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRecyclingPreference = (material) => {
    setFormData(prev => {
      const preferences = [...prev.recyclingPreferences];
      if (preferences.includes(material)) {
        return { ...prev, recyclingPreferences: preferences.filter(m => m !== material) };
      }
      return { ...prev, recyclingPreferences: [...preferences, material] };
    });
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
        setFormData(prev => ({ ...prev, avatar: data.secure_url }));
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
      const res = await fetch(`/backend/user/update/${currentUser._id}`, {
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
        ...(isGoogleAuth && { verificationCode })
      };

      if (!isGoogleAuth) {
        body.currentPassword = passwordData.currentPassword;
      }

      body.confirmPassword = passwordData.confirmPassword;

      console.log(body);

      const res = await fetch(`/backend/user/update-password/${currentUser._id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
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
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) 
      return;

    try {
      dispatch(DeleteUserStart());
      const res = await fetch(`/backend/user/delete/${currentUser._id}`, {
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
        {/* Message Alert and Profile Header remain same as previous */}
        {message && (
          <div className={`mb-4 p-4 rounded-md ${
            messageType === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}>
            {message}
          </div>
        )}

        {/* Profile Header */}
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <img
                src={avatarUrl || "/eco-avatar.png"}
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
                {currentUser?.username}
              </h1>
              <p className="text-gray-600 flex items-center justify-center md:justify-start gap-1 mt-1">
                <FaMapMarkerAlt className="text-green-600" />
                {currentUser?.location || "No location set"}
              </p>
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

        {/* Profile Details */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
            Environmental Profile
          </h2>
          
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="flex items-center gap-2 bg-green-50 p-3 rounded-md">
                <FaUser className="text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="flex items-center gap-2 bg-green-50 p-3 rounded-md">
                <FaEnvelope className="text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <div className="flex items-center gap-2 bg-green-50 p-3 rounded-md">
                <FaMapMarkerAlt className="text-gray-400" />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Enter your city"
                  className="w-full bg-transparent focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recycling Preferences
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {recyclingOptions.map((material) => (
                  <button
                    key={material}
                    type="button"
                    onClick={() => handleRecyclingPreference(material)}
                    disabled={!isEditing}
                    className={`flex items-center gap-2 p-2 rounded-md text-sm ${
                      formData.recyclingPreferences.includes(material)
                        ? 'bg-green-600 text-white'
                        : 'bg-green-50 text-gray-700'
                    }`}
                  >
                    <FaRecycle />
                    {material}
                  </button>
                ))}
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
          </form>
        </div>

        {/* Password Change Modal */}
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
                        onChange={(e) => setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value
                        })}
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
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value
                      })}
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
                      onChange={(e) => setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value
                      })}
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

        {/* Account Management Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-red-600">Account Actions</h3>
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