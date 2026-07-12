import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios.js';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic frontend validation
    if (!fullName || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/users/register', { 
        fullName, 
        email, 
        password 
      });

      toast.success('Account created successfully! Please sign in.');
      console.log('Registration successful:', response.data);

      // Redirect the user to the login page so they can sign in
      navigate('/');

    } catch (err) {
      // Safely extract the error message from your backend response
      const errorMessage = err.response?.data?.message || 'Failed to create account. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Header Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        {/* GitHub-style Logo Icon */}
        <svg height="48" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="48" data-view-component="true" className="fill-[#24292f] mb-6">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
        </svg>
        <h2 className="text-center text-[24px] font-light tracking-tight text-[#24292f]">
          Create your account
        </h2>
      </div>

      {/* Main Form Card */}
      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-[340px]">
        <div className="bg-white py-5 px-4 shadow-sm sm:rounded-md sm:px-6 border border-[#d0d7de]">
          
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="fullName" className="block text-sm font-semibold text-[#24292f] mb-1.5">
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="appearance-none block w-full px-3 py-1.5 border border-[#d0d7de] rounded-md shadow-sm placeholder-gray-400 bg-[#f6f8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:border-[#0969da] sm:text-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-[#24292f] mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-3 py-1.5 border border-[#d0d7de] rounded-md shadow-sm placeholder-gray-400 bg-[#f6f8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:border-[#0969da] sm:text-sm transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#24292f] mb-1.5">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-1.5 border border-[#d0d7de] rounded-md shadow-sm placeholder-gray-400 bg-[#f6f8fa] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0969da] focus:border-[#0969da] sm:text-sm transition-colors"
              />
              <p className="mt-1.5 text-xs text-[#57606a]">
                Make sure it's at least 6 characters.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2da44e] hover:bg-[#2c974b] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2da44e] disabled:opacity-70 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing up...
                  </span>
                ) : (
                  'Sign up'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* GitHub-style Bottom Box */}
        <div className="mt-4 py-4 px-4 border border-[#d0d7de] rounded-md text-center text-sm text-[#24292f]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0969da] hover:underline">
            Sign in
          </Link>
          .
        </div>
      </div>
    </div>
  );
}