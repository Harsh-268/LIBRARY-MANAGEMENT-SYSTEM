import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios.js';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await api.post(`/users/reset-password/${token}`, { newPassword });
      toast.success('Password reset successfully! Please sign in.');
      navigate('/login');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Reset link is invalid or has expired.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <h2 className="text-center text-[24px] font-light tracking-tight text-[#24292f]">
          Set a new password
        </h2>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[340px]">
        <div className="bg-white py-5 px-4 shadow-sm sm:rounded-md sm:px-6 border border-[#d0d7de]">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-semibold text-[#24292f] mb-1.5">
                New password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-1.5 border border-[#d0d7de] rounded-md shadow-sm placeholder-gray-400 bg-[#f6f8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:border-[#0969da] sm:text-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-[#24292f] mb-1.5">
                Confirm new password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-1.5 border border-[#d0d7de] rounded-md shadow-sm placeholder-gray-400 bg-[#f6f8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:border-[#0969da] sm:text-sm transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2da44e] hover:bg-[#2c974b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2da44e] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? 'Resetting...' : 'Reset password'}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-4 py-4 px-4 border border-[#d0d7de] rounded-md text-center text-sm text-[#24292f]">
          <Link to="/login" className="text-[#0969da] hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}