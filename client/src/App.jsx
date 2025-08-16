import React from "react";
import { Route, Routes } from "react-router-dom";
import { AppProvider, useAppContext } from "./context/AppContext";
import Navigation from "./components/Navigation";
import Home from "./Home";
import DataEntry from "./components/DataEntry";
import Visualization from "./components/Visualization";
import Settings from "./components/Settings";

const AppContent = () => {
  const { isLoading } = useAppContext();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading your data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/data-entry" element={<DataEntry />} />
        <Route path="/visualization" element={<Visualization />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;