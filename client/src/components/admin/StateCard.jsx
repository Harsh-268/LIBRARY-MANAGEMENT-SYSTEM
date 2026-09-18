import React from 'react';
import { Link } from 'react-router-dom';

const ACCENTS = {
  gray: 'text-gray-900',
  blue: 'text-blue-600',
  red: 'text-red-600',
  green: 'text-green-600',
};

const StatCard = ({ label, value, to, accent = 'gray' }) => {
  const content = (
    <div className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${ACCENTS[accent] || ACCENTS.gray}`}>{value}</p>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};

export default StatCard;