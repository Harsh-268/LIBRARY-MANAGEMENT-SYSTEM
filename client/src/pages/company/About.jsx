import React from 'react';
import { Link } from 'react-router-dom';

const stats = [
  { label: 'Books in Library', value: '10,000+' },
  { label: 'Active Readers', value: '2,500+' },
  { label: 'Genres Covered', value: '30+' },
  { label: 'Books Issued Monthly', value: '1,200+' },
];

const values = [
  {
    title: 'Access for Everyone',
    description:
      'We believe great books should be easy to find and easy to borrow. Our platform is built to remove friction between readers and the stories they want to discover.',
  },
  {
    title: 'Built for Reliability',
    description:
      'From accurate due-date tracking to transparent fine calculations, we designed every part of the system to be predictable and fair for both students and administrators.',
  },
  {
    title: 'Community Driven',
    description:
      "Your feedback shapes what we build next. Whether it's a feature request or a bug report, every message through our Contact page helps us improve.",
  },
];

export default function About() {
  return (
    <div className="flex flex-col items-center">
      {/* --- HERO SECTION --- */}
      <section className="w-full bg-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            About <span className="text-blue-500">BookStore</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We're building a simpler way to browse, borrow, and manage books — for readers and
            librarians alike.
          </p>
        </div>
      </section>

      {/* --- OUR STORY --- */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
          <p className="text-gray-600 leading-relaxed">
            BookStore started as a simple idea: library systems shouldn't feel like paperwork.
            We set out to build a library management platform that's fast to search, easy to
            navigate, and genuinely pleasant to use — whether you're a student looking for your
            next read or an administrator tracking hundreds of active issues. What began as a
            small project has grown into a full platform covering search, borrowing, fines, and
            reporting, all in one place.
          </p>
        </div>
      </section>

      {/* --- STATS --- */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl sm:text-4xl font-extrabold text-blue-600 mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- VALUES --- */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What We Value</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-gray-50 border border-gray-100 rounded-xl p-8 hover:shadow-md hover:border-blue-100 transition-all"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Have questions or feedback?</h2>
          <p className="text-gray-400 mb-8">
            We'd love to hear from you. Reach out and let us know how we can improve.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-lg"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}