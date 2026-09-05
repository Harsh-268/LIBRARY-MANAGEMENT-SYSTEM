import React from 'react';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By creating an account or using BookStore, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform.`,
  },
  {
    title: '2. Account Responsibilities',
    content: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately of any unauthorized use.`,
  },
  {
    title: '3. Borrowing Rules',
    content: `Books may be borrowed for a standard loan period, with a limited number of renewals available per book, provided the book is not overdue at the time of renewal. Each account may hold a maximum number of active issues at any given time.`,
  },
  {
    title: '4. Fines & Overdue Books',
    content: `Books returned after their due date are subject to a daily fine, calculated automatically based on the number of days overdue. Outstanding fines may restrict your ability to borrow additional books until resolved.`,
  },
  {
    title: '5. Prohibited Conduct',
    content: `You agree not to misuse the platform, including attempting to circumvent borrowing limits, tampering with book records, or using the service for any unlawful purpose.`,
  },
  {
    title: '6. Administrator Rights',
    content: `Library administrators reserve the right to manage inventory, issue or revoke borrowing privileges, update fine statuses, and moderate accounts found to be in violation of these terms.`,
  },
  {
    title: '7. Limitation of Liability',
    content: `BookStore is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform.`,
  },
  {
    title: '8. Changes to These Terms',
    content: `We may revise these Terms of Service periodically. Continued use of the platform after changes take effect constitutes your acceptance of the updated terms.`,
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight mb-3">
          Terms of Service
        </h1>
        <p className="text-sm text-gray-400 mb-10">Last updated: September 4, 2026</p>

        <p className="text-gray-600 leading-relaxed mb-10">
          These Terms of Service govern your use of the BookStore library management system.
          Please read them carefully before creating an account.
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
          Questions about these terms? Visit our{' '}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contact page
          </a>
          .
        </div>
      </div>
    </div>
  );
}