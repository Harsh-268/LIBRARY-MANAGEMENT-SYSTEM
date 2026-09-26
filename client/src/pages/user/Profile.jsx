import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext.jsx";
import { updateUserInfo, changeUserPassword } from "../../services/user.service.js";
import Modal from "../../components/common/Modal.jsx";
import EditIconBtn from "../../components/common/EditIconBtn.jsx";

const THEME_STORAGE_KEY = "lms-theme-preference";

const Profile = () => {
  
   const { user, setUser } = useAuth();

  // --- Modal visibility ---
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // --- Profile info form state ---
  // Email is intentionally not part of the editable form state — it is
  // displayed (from `user.email`) but can never be changed by the user.
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [savingProfile, setSavingProfile] = useState(false);

  // --- Password form state ---
  const [oldPassword, setoldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  // --- Theme state (local only for now) ---
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_STORAGE_KEY) || "light"
  );

  const openProfileModal = () => {
    // reset fields to current values each time it's opened
    setFullName(user?.fullName || "");
    setShowProfileModal(true);
  };

  const openPasswordModal = () => {
    setoldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setShowPasswordModal(true);
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Name can't be empty.");
      return;
    }

    setSavingProfile(true);
    try {
      const updatedUser = await updateUserInfo({ fullName: fullName.trim() });
      setUser(updatedUser);
      toast.success("Profile updated successfully.");
      setShowProfileModal(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update profile.";
      toast.error(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirmation don't match.");
      return;
    }
    if (newPassword === oldPassword) {
      toast.error("New password must be different from your current password.");
      return;
    }

    setChangingPassword(true);
    try {
      await changeUserPassword({ oldPassword, newPassword });
      toast.success("Password changed successfully.");
      setShowPasswordModal(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to change password.";
      toast.error(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleThemeChange = (nextTheme) => {
    setTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    // TODO: once ThemeContext exists, replace this with context's setTheme
  };

  const initials = (user?.fullName || "?")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Profile & Settings</h1>
        <p className="text-gray-500">Manage your account details and preferences.</p>
      </div>

      {/* --- Identity header --- */}
      <div className="flex items-center gap-4 bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-semibold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{user?.fullName}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {user?.role}
          </span>
        </div>
      </div>

      {/* --- Personal Information (display mode) --- */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
          <EditIconBtn onClick={openProfileModal} label="Edit personal information" />
        </div>
        <p className="text-sm text-gray-500 mb-4">Your name and email address.</p>

        <dl className="space-y-3">
          <div className="flex justify-between text-sm">
            <dt className="text-gray-500">Full Name</dt>
            <dd className="text-gray-900 font-medium">{user?.fullName}</dd>
          </div>
          <div className="flex justify-between text-sm">
            <dt className="text-gray-500">Email Address</dt>
            <dd className="text-gray-900 font-medium">{user?.email}</dd>
          </div>
        </dl>
      </div>

      {/* --- Password (display mode) --- */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold text-gray-900">Password</h2>
          <EditIconBtn onClick={openPasswordModal} label="Change password" />
        </div>
        <p className="text-sm text-gray-500">
          ••••••••••• &nbsp;·&nbsp; Last changed information not tracked yet
        </p>
      </div>

      {/* --- Appearance (placeholder until ThemeContext) --- */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Appearance</h2>
        <p className="text-sm text-gray-500 mb-4">
          Choose how BookStore looks on your device.
        </p>

        <div className="flex gap-3">
          {["light", "dark"].map((option) => (
            <button
              key={option}
              onClick={() => handleThemeChange(option)}
              className={`flex-1 border rounded-lg py-3 text-sm font-medium capitalize transition-colors ${
                theme === option
                  ? "border-blue-600 bg-blue-50 text-blue-700"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Saved locally for now — this will sync through a ThemeContext once that's wired up.
        </p>
      </div>

      {/* --- Edit Profile Modal --- */}
      {showProfileModal && (
        <Modal
          title="Edit Personal Information"
          subtitle="Update your name. Email can't be changed."
          onClose={() => setShowProfileModal(false)}
        >
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={user?.email || ""}
                disabled
                readOnly
                aria-readonly="true"
                title="Email address can't be changed"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Your email address can't be changed. Contact an administrator if you need it updated.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="text-sm font-medium px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingProfile}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* --- Change Password Modal --- */}
      {showPasswordModal && (
        <Modal
          title="Change Password"
          subtitle="Choose a strong password you're not using elsewhere."
          onClose={() => setShowPasswordModal(false)}
        >
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Current Password
              </label>
              <input
                id="oldPassword"
                type="password"
                autoComplete="current-password"
                autoFocus
                value={oldPassword}
                onChange={(e) => setoldPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <input
                id="confirmNewPassword"
                type="password"
                autoComplete="new-password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-sm font-medium px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={changingPassword}
                className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {changingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Profile;