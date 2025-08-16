import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-200 p-8">
      <div className="max-w-6xl mx-auto p-8">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-4">
            <span className="text-5xl">🏀</span>
            Basketball Stats Pro
          </h1>
          <p className="text-2xl text-gray-600 mt-4">Transform your game analysis with powerful statistics</p>
        </header>

        <main>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8">
            <Link
              to="/data-entry"
              className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group"
            >
              <div>
                <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform duration-300">📋</span>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Data Entry</h2>
                <p className="text-gray-600 leading-relaxed">Record shot locations and detailed statistics</p>
              </div>
            </Link>

            <Link
              to="/visualization"
              className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group"
            >
              <div>
                <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform duration-300">📊</span>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Visualization</h2>
                <p className="text-gray-600 leading-relaxed">Analyze performance with interactive charts</p>
              </div>
            </Link>

            <Link
              to="/settings"
              className="bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 group"
            >
              <div>
                <span className="text-5xl block mb-4 group-hover:scale-110 transition-transform duration-300">⚙️</span>
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Settings</h2>
                <p className="text-gray-600 leading-relaxed">Customize tracking parameters and options</p>
              </div>
            </Link>
          </div>
        </main>

        <footer className="text-center mt-16 pt-8 border-t border-gray-300">
          <p className="text-gray-600">Designed for basketball excellence</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;