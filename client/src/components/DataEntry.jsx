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
    shotValue: '2', // Add shot value field
    customFields: {} 
  });

  // Simple 2/3 point detection based on court position
  const detectShotType = (x, y) => {
    // Basket is at top center, three-point line detection
    const basketX = 50;
    const basketY = 8;
    
    const distance = Math.sqrt(Math.pow(x - basketX, 2) + Math.pow(y - basketY, 2));
    
    // Corner threes (left and right sides)
    if ((x < 25 || x > 75) && y > 15 && y < 45) {
      return '3';
    }
    
    // Arc three-point line
    if (y > 25 && distance > 30) {
      return '3';
    }
    
    // Beyond half court
    if (y > 55) {
      return '3';
    }
    
    return '2';
  };

  const handleCourtClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const detectedShotValue = detectShotType(x, y);

    setShotData(prev => ({
      ...prev,
      coordinates: { x, y },
      shotValue: detectedShotValue,
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
      "x", "y", "shotValue", "contestLevel", "shotCreationType", "defenseType",
      "shotType", "postMove", "dribbleCount", "made",
      ...customParameters.map(param => param.name)
    ];

    const rows = shots.map(shot =>
      [
        shot.coordinates.x,
        shot.coordinates.y,
        shot.shotValue || '2',
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

  // Calculate stats
  const madeShots = shots.filter(s => s.made).length;
  const missedShots = shots.filter(s => !s.made).length;
  const totalShots = shots.length;
  const shootingPercentage = totalShots > 0 ? Math.round((madeShots / totalShots) * 100) : 0;
  
  const twoPointers = shots.filter(s => s.shotValue === '2');
  const threePointers = shots.filter(s => s.shotValue === '3');
  
  const madeThrees = threePointers.filter(s => s.made).length;
  const madeTwos = twoPointers.filter(s => s.made).length;
  
  const threePtPercentage = threePointers.length > 0 ? Math.round((madeThrees / threePointers.length) * 100) : 0;
  const twoPtPercentage = twoPointers.length > 0 ? Math.round((madeTwos / twoPointers.length) * 100) : 0;

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
                className={`absolute w-6 h-6 rounded-full border-3 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-125 ${
                  shot.made
                    ? shot.shotValue === '3' 
                      ? 'bg-green-500 border-green-700 shadow-lg shadow-green-500/50'
                      : 'bg-emerald-500 border-emerald-700 shadow-lg shadow-emerald-500/50'
                    : 'bg-red-500 border-red-700 shadow-lg shadow-red-500/50'
                }`}
                style={{
                  left: `${shot.coordinates.x}%`,
                  top: `${shot.coordinates.y}%`,
                }}
                title={`${shot.made ? 'Made' : 'Missed'} ${shot.shotValue || '2'}PT | ${shot.shotType || shot.shotCreationType} | ${shot.defenseType}`}
              />
            ))}
          </div>

          {/* Enhanced Stats Display */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{madeShots}</div>
              <div className="text-sm opacity-90">Made</div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{missedShots}</div>
              <div className="text-sm opacity-90">Missed</div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{shootingPercentage}%</div>
              <div className="text-sm opacity-90">Overall %</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{twoPtPercentage}%</div>
              <div className="text-sm opacity-90">2PT %</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">{threePtPercentage}%</div>
              <div className="text-sm opacity-90">3PT %</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleDownloadCSV}
            disabled={shots.length === 0}
            className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 ${
              shots.length === 0
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
          onShotValueChange={(value) => setShotData(prev => ({ ...prev, shotValue: value }))}
        />
      </div>
    </div>
  );
};

export default DataEntry;