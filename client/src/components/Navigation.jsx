import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/home', label: 'Home', icon: '🏠' },
    { path: '/data-entry', label: 'Data Entry', icon: '📋' },
    { path: '/visualization', label: 'Visualization', icon: '📊' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:text-orange-600 transition-colors">
            <span className="text-2xl">🏀</span>
            Basketball Stats Pro
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${
                  location.pathname === item.path
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-orange-600 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;