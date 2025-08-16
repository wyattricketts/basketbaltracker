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
          {/* Instructions Section */}
          <section className="max-w-3xl mx-auto mb-12 bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center">
            <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">How to Use</h2>
            <ul className="text-lg text-gray-700 space-y-2 mb-4 list-disc list-inside">
              <li><strong>Add Shots:</strong> Go to <span className="font-semibold text-blue-600">Data Entry</span> to record your shots and stats.</li>
              <li><strong>Custom Parameters:</strong> Use <span className="font-semibold text-blue-600">Settings</span> to track extra stats (e.g., shot type, location).</li>
              <li><strong>Saving Progress:</strong> Your data is auto-saved locally. You <span className="font-semibold text-blue-600">Can</span> refresh. To keep data when closing the tab, "export backup" in the settings tab, then re upload next session </li>
              <li><strong>Data Safety:</strong> If your browser storage is full, you’ll get a warning. Export your data regularly!</li>
            </ul>
            <div className="text-gray-500 text-center italic">
              Tip: Custom parameters let you track anything—like shot type, location, or player mood!
            </div>
          </section>
          {/* Existing grid of links */}
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
          <p className="text-gray-600">Designed by Wyatt Ricketts for Owen Ricketts</p>
        </footer>
      </div>
    </div>
  );
};

export default Home;