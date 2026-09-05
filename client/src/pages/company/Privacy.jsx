import React from 'react';

const sections = [
  {
    title: '1. Information We Collect',
    content: `We collect information you provide directly to us, such as your full name, email address, and password when you register for an account. We also automatically collect certain information about your borrowing activity, including books issued, due dates, renewals, and fines, in order to operate the library management system.`,
  },
  {
    title: '2. How We Use Your Information',
    content: `We use the information we collect to create and manage your account, process book issues and returns, calculate and track fines, send you notifications about due dates or overdue books, and improve the overall functionality of the platform.`,
  },
  {
    title: '3. Cookies & Authentication',
    content: `We use HTTP-only cookies to store authentication tokens (access and refresh tokens) that keep you signed in securely. These cookies are essential for the site to function and are not used for advertising or third-party tracking.`,
  },
  {
    title: '4. Data Sharing',
    content: `We do not sell, rent, or trade your personal information to third parties. Your data may only be shared with library administrators for the purpose of managing issues, returns, and fine collection.`,
  },
  {
    title: '5. Data Security',
    content: `Passwords are hashed before storage and are never stored or transmitted in plain text. We use industry-standard practices to protect your account information, though no method of electronic storage is ever 100% secure.`,
  },
  {
    title: '6. Data Retention',
    content: `We retain your account and borrowing history for as long as your account remains active, or as needed to comply with our legal obligations, resolve disputes, and enforce our policies.`,
  },
  {
    title: '7. Your Rights',
    content: `You may access, update, or request deletion of your personal information at any time by visiting your Profile & Settings page or by contacting us directly.`,
  },
  {
    title: '8. Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. Continued use of the service after changes are posted constitutes acceptance of the revised policy.`,
  },
];

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: September 4, 2026</p>

        <p className="text-gray-600 leading-relaxed mb-10">
          This Privacy Policy explains how BookStore ("we", "us", or "our") collects, uses, and
          protects your information when you use our library management system.
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{section.title}</h2>
              <p className="text-gray-600 leading-relaxed text-sm">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500">
          Questions about this policy? Visit our{' '}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contact page
          </a>
          .
        </div>
      </div>
    </div>
  );
}