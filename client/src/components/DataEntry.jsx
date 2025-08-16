import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import ShotModal from './ShotModal';
import basketballCourt from '../assets/image.png';

const DataEntry = () => {
  const { shots, addShot, customParameters } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shotData, setShotData] = useState({
    coordinates: { x: 0, y: 0 },
    contestLevel: '',
    shotCreationType: '',
    defenseType: '',
    shotType: '',
    postMove: '',
    dribbleCount: 0,
    made: false,
    customFields: {} 
  });

  const handleCourtClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setShotData(prev => ({
      ...prev,
      coordinates: { x, y },
      modalPosition: {
        left: e.clientX,
        top: e.clientY
      }
    }));
    setIsModalOpen(true);
  };

  const handleShotSubmit = (data) => {
    addShot(data);
    setIsModalOpen(false);
  };

  const handleDownloadCSV = () => {
    const headers = [
      "x", "y", "contestLevel", "shotCreationType", "defenseType",
      "shotType", "postMove", "dribbleCount", "made",
      ...customParameters.map(param => param.name)
    ];

    const rows = shots.map(shot =>
      [
        shot.coordinates.x,
        shot.coordinates.y,
        shot.contestLevel || '',
        shot.shotCreationType || '',
        shot.defenseType || '',
        shot.shotType || '',
        shot.postMove || '',
        shot.dribbleCount || 0,
        shot.made ? "Made" : "Missed",
        ...customParameters.map(param => shot.customFields?.[param.name] || '')
      ].join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "basketball_shots.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-800 mb-2">Basketball Shot Data Entry</h1>
          <p className="text-orange-600">Click anywhere on the court to record a shot</p>
        </div>

        {/* Court Container */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="relative w-full bg-gradient-to-br from-green-50 to-green-100 rounded-2xl overflow-hidden border-4 border-green-200 shadow-inner">
            <img
              src={basketballCourt}
              alt="Basketball Court"
              className="w-full h-auto object-contain cursor-crosshair hover:opacity-90 transition-opacity"
              onClick={handleCourtClick}
            />
            {/* Shot Markers */}
            {shots.map((shot, index) => (
              <div
                key={shot.id || index}
                className={`absolute w-6 h-6 rounded-full border-3 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-125 ${shot.made
                    ? 'bg-emerald-500 border-emerald-700 shadow-lg shadow-emerald-500/50'
                    : 'bg-red-500 border-red-700 shadow-lg shadow-red-500/50'
                  }`}
                style={{
                  left: `${shot.coordinates.x}%`,
                  top: `${shot.coordinates.y}%`,
                }}
                title={`${shot.made ? 'Made' : 'Missed'} | ${shot.shotType || shot.shotCreationType} | ${shot.defenseType}`}
              />
            ))}
          </div>

          {/* Stats Display */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{shots.filter(s => s.made).length}</div>
              <div className="text-sm opacity-90">Made Shots</div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{shots.filter(s => !s.made).length}</div>
              <div className="text-sm opacity-90">Missed Shots</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{shots.length > 0 ? Math.round((shots.filter(s => s.made).length / shots.length) * 100) : 0}%</div>
              <div className="text-sm opacity-90">Shooting %</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleDownloadCSV}
            disabled={shots.length === 0}
            className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 ${shots.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 transform hover:scale-105 shadow-xl'
              }`}
          >
            📊 Download CSV ({shots.length} shots)
          </button>
        </div>

        {/* Modal */}
        <ShotModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleShotSubmit}
          initialData={shotData}
          customParameters={customParameters}
        />
      </div>
    </div>
  );
};

export default DataEntry;