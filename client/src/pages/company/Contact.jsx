import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { sendContactMessage } from '../../services/contact.service.js';
import { normalizeApiError, extractFieldErrors } from '../../utils/zod.error.util.js';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      await sendContactMessage(formData);
      toast.success("Message sent! We'll get back to you soon.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      const fieldErrors = err.response?.data?.errors;
      if (fieldErrors?.length) {
        setErrors(extractFieldErrors(fieldErrors));
        toast.error('Please fix the errors below.');
      } else {
        toast.error(normalizeApiError(err));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 bg-[#f6f8fa] dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:bg-white dark:focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0969da] dark:focus:ring-blue-500 sm:text-sm transition-colors ${
      errors[field]
        ? 'border-red-400 dark:border-red-500 focus:ring-red-400'
        : 'border-[#d0d7de] dark:border-gray-600 focus:border-[#0969da] dark:focus:border-blue-500'
    }`;

  const labelClass = 'block text-sm font-semibold text-[#24292f] dark:text-gray-200 mb-1.5';

  return (
    <div className="min-h-screen bg-[#f6f8fa] dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Contact <span className="text-blue-600 dark:text-blue-400">Us</span>
          </h1>
          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Have a question, found a bug, or just want to say hi? Drop us a message below.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 py-8 px-6 sm:px-8 shadow-sm rounded-lg border border-[#d0d7de] dark:border-gray-700">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Your Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputClass('name')}
                  placeholder="Jane Doe"
                />
                {errors.name && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={inputClass('email')}
                  placeholder="jane@example.com"
                />
                {errors.email && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="subject" className={labelClass}>
                Subject
              </label>
              <input
                id="subject"
                name="subject"
                type="text"
                required
                value={formData.subject}
                onChange={handleChange}
                className={inputClass('subject')}
                placeholder="What's this about?"
              />
              {errors.subject && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.subject}</p>}
            </div>

            <div>
              <label htmlFor="message" className={labelClass}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                value={formData.message}
                onChange={handleChange}
                className={`${inputClass('message')} resize-none`}
                placeholder="Tell us more..."
              />
              {errors.message && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 dark:focus:ring-offset-gray-900 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          Prefer email? Reach us directly at{' '}
          <a href="mailto:support@bookstore.app" className="text-blue-600 dark:text-blue-400 hover:underline">
            support@bookstore.app
          </a>
        </p>
      </div>
    </div>
  );
}