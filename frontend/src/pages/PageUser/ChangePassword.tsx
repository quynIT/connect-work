import React, { useState } from "react";
import { getUserProfile } from "../../services/authService";
const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState<string | null>(null); // Biến lưu thông báo lỗi
  const [iduser, setIduser] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate mật khẩu
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== retypePassword) {
      setError("New password and re-typed password do not match.");
      return;
    }

    setError(null); // Xóa lỗi trước khi gửi

    try {
      const profile = await getUserProfile();
      setIduser(profile._id);
      const response = await fetch(
        `http://localhost:3000/user/${profile._id}/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            oldPassword: currentPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Failed to change password.");
      } else {
        alert("Password changed successfully!");
        // Reset form sau khi thành công
        setCurrentPassword("");
        setNewPassword("");
        setRetypePassword("");
      }
    } catch (e) {
      setError("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="mt-6 min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-center mb-2">
            Change Password
          </h1>
          <p className="text-sm text-gray-600 text-center">
            Your password must be at least 6 characters and should include a
            combination of numbers, letters, and special characters (!@$%).
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Current Password */}
          <div className="mb-4">
            <label
              htmlFor="currentPassword"
              className="block text-sm text-gray-700 mb-2"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter your current password"
              required
            />
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm text-gray-700 mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Enter your new password"
              required
            />
          </div>

          {/* Retype New Password */}
          <div className="mb-4">
            <label
              htmlFor="retypePassword"
              className="block text-sm text-gray-700 mb-2"
            >
              Re-type New Password
            </label>
            <input
              type="password"
              id="retypePassword"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="Re-enter your new password"
              required
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
