import React from 'react';
import { Link } from 'react-router-dom';

const ACCENTS = {
  gray: 'text-gray-900 dark:text-gray-100',
  blue: 'text-blue-600 dark:text-blue-400',
  red: 'text-red-600 dark:text-red-400',
  green: 'text-green-600 dark:text-green-400',
};

const StatCard = ({ label, value, to, accent = 'gray' }) => {
  const content = (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:shadow-sm transition-shadow">
      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${ACCENTS[accent] || ACCENTS.gray}`}>{value}</p>
    </div>
  );

  return to ? <Link to={to}>{content}</Link> : content;
};

export default StatCard;