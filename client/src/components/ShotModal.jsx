import React, { useState, useEffect } from 'react';

const ShotModal = ({ isOpen, onClose, onSubmit, initialData, customParameters = [], onShotValueChange }) => {
  const [formData, setFormData] = useState({
    coordinates: { x: 0, y: 0 },
    contestLevel: '',
    shotCreationType: '',
    defenseType: '',
    shotType: '',
    postMove: '',
    dribbleCount: 0,
    made: false,
    shotValue: '2', // Make sure this is included
    customFields: {}
  });

  // Update formData when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        shotValue: initialData.shotValue || '2' // Ensure shotValue is set
      }));
    }
  }, [initialData]);

  // All parameter options
  const contestLevels = ['Uncontested', 'Mid-Contest', 'Contested'];
  const shotCreationTypes = ['Catch and shoot', 'Off the dribble', 'Pump Fake', 'O-board'];
  const defenseTypes = ['Man/Zone', 'Transition/Halfcourt'];
  const shotTypes = ['Floater', 'Hook', 'Fadeaway', 'Jumpshot', 'Tip in', 'Runner', 'Post-up'];
  const postMoves = ['Pin', 'Face up', 'Right-shoulder', 'Left-shoulder'];

  if (!isOpen) return null;

  // Modal position with viewport boundary checks
  const modalStyle = initialData.modalPosition
    ? {
      position: 'fixed',
      left: Math.min(Math.max(initialData.modalPosition.left, 300), window.innerWidth - 300),
      top: Math.min(Math.max(initialData.modalPosition.top, 400), window.innerHeight - 400),
      transform: 'translate(-50%, -50%)',
      zIndex: 50,
    }
    : {};

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/30 via-black/50 to-black/70 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl max-h-[90vh] overflow-hidden"
        style={modalStyle}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Shot Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Selected Values Display */}
          <div className="flex flex-wrap gap-2 mt-3 text-sm">
            {formData.contestLevel && (
              <span className="px-2 py-1 bg-white/20 backdrop-blur rounded-full font-medium">
                ⚡ {formData.contestLevel}
              </span>
            )}
            {formData.shotCreationType && (
              <span className="px-2 py-1 bg-white/20 backdrop-blur rounded-full font-medium">
                🏀 {formData.shotCreationType}
              </span>
            )}
            {formData.defenseType && (
              <span className="px-2 py-1 bg-white/20 backdrop-blur rounded-full font-medium">
                🛡️ {formData.defenseType}
              </span>
            )}
            {formData.shotType && (
              <span className="px-2 py-1 bg-white/20 backdrop-blur rounded-full font-medium">
                🎯 {formData.shotType}
              </span>
            )}
            {formData.postMove && (
              <span className="px-2 py-1 bg-white/20 backdrop-blur rounded-full font-medium">
                📍 {formData.postMove}
              </span>
            )}
            {/* Custom Parameters Display */}
            {customParameters.map(param => {
              const value = formData.customFields?.[param.name];
              if (value) {
                return (
                  <span key={param.name} className="px-2 py-1 bg-white/20 backdrop-blur rounded-full font-medium">
                    {param.icon} {value}
                  </span>
                );
              }
              return null;
            })}
            <span className="px-2 py-1 bg-white/20 backdrop-blur rounded-full font-medium">
              🔢 {formData.dribbleCount} dribbles
            </span>
            <span className={`px-2 py-1 backdrop-blur rounded-full font-medium ${formData.made ? 'bg-green-400/30' : 'bg-red-400/30'
              }`}>
              {formData.made ? '✅ Made' : '❌ Missed'}
            </span>
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          <form
            onSubmit={e => {
              e.preventDefault();
              onSubmit(formData);
            }}
            className="space-y-5"
          >
            {/* Shot Value Toggle */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shot Value (Auto-detected: {initialData.shotValue})
              </label>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, shotValue: '2' }));
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${formData.shotValue === '2'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  2 Pointer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, shotValue: '3' }));
                  }}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${formData.shotValue === '3'
                    ? 'bg-purple-500 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  3 Pointer
                </button>
              </div>
            </div>

            {/* Contest Level */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-800 flex items-center gap-2">
                ⚡ Contest Level
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {contestLevels.map(level => (
                  <button
                    key={level}
                    type="button"
                    className={`py-2 px-3 rounded-lg border-2 font-medium transition-all duration-200 text-sm ${formData.contestLevel === level
                      ? 'bg-purple-500 text-white border-purple-500 shadow-lg transform scale-105'
                      : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300'
                      }`}
                    onClick={() =>
                      setFormData(prev => ({ ...prev, contestLevel: level }))
                    }
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Shot Creation */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-800 flex items-center gap-2">
                🏀 Shot Creation
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {shotCreationTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`py-2 px-3 rounded-lg border-2 font-medium transition-all duration-200 text-sm ${formData.shotCreationType === type
                      ? 'bg-green-500 text-white border-green-500 shadow-lg transform scale-105'
                      : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300'
                      }`}
                    onClick={() =>
                      setFormData(prev => ({ ...prev, shotCreationType: type }))
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Defense Type */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-800 flex items-center gap-2">
                🛡️ Defense Type
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {defenseTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`py-2 px-3 rounded-lg border-2 font-medium transition-all duration-200 text-sm ${formData.defenseType === type
                      ? 'bg-blue-500 text-white border-blue-500 shadow-lg transform scale-105'
                      : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300'
                      }`}
                    onClick={() =>
                      setFormData(prev => ({ ...prev, defenseType: type }))
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Shot Type */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-800 flex items-center gap-2">
                🎯 Shot Type
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {shotTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`py-2 px-2 rounded-lg border-2 font-medium transition-all duration-200 text-xs ${formData.shotType === type
                      ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg transform scale-105'
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300'
                      }`}
                    onClick={() =>
                      setFormData(prev => ({ ...prev, shotType: type }))
                    }
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Post Moves */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-800 flex items-center gap-2">
                📍 Post Move
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {postMoves.map(move => (
                  <button
                    key={move}
                    type="button"
                    className={`py-2 px-3 rounded-lg border-2 font-medium transition-all duration-200 text-sm ${formData.postMove === move
                      ? 'bg-amber-500 text-white border-amber-500 shadow-lg transform scale-105'
                      : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:border-amber-300'
                      }`}
                    onClick={() =>
                      setFormData(prev => ({ ...prev, postMove: move }))
                    }
                  >
                    {move}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Parameters */}
            {customParameters.map(param => (
              <div key={param.id}>
                <h3 className="text-base font-semibold mb-2 text-gray-800 flex items-center gap-2">
                  {param.icon} {param.name}
                </h3>

                {param.type === 'categorical' ? (
                  <div className="grid grid-cols-2 gap-2">
                    {param.options.map(option => (
                      <button
                        key={option}
                        type="button"
                        className={`py-2 px-3 rounded-lg border-2 font-medium transition-all duration-200 text-sm ${formData.customFields?.[param.name] === option
                          ? 'bg-pink-500 text-white border-pink-500 shadow-lg transform scale-105'
                          : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100 hover:border-pink-300'
                          }`}
                        onClick={() =>
                          setFormData(prev => ({
                            ...prev,
                            customFields: {
                              ...prev.customFields,
                              [param.name]: option
                            }
                          }))
                        }
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      value={formData.customFields?.[param.name] || param.min}
                      onChange={e =>
                        setFormData(prev => ({
                          ...prev,
                          customFields: {
                            ...prev.customFields,
                            [param.name]: parseInt(e.target.value)
                          }
                        }))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${((formData.customFields?.[param.name] || param.min) - param.min) / (param.max - param.min) * 100}%, #e5e7eb ${((formData.customFields?.[param.name] || param.min) - param.min) / (param.max - param.min) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>{param.min}</span>
                      <span className="font-bold text-pink-600">{formData.customFields?.[param.name] || param.min}</span>
                      <span>{param.max}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Dribbles */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-800 flex items-center gap-2">
                🔢 Number of Dribbles
              </h3>
              <div className="bg-gray-50 rounded-xl p-3">
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={formData.dribbleCount || 0}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      dribbleCount: parseInt(e.target.value),
                    }))
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #f97316 0%, #f97316 ${((formData.dribbleCount || 0) / 15) * 100}%, #e5e7eb ${((formData.dribbleCount || 0) / 15) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>0</span>
                  <span className="font-bold text-orange-600">{formData.dribbleCount || 0}</span>
                  <span>15</span>
                </div>
              </div>
            </div>

            {/* Shot Result */}
            <div>
              <h3 className="text-base font-semibold mb-2 text-gray-800 flex items-center gap-2">
                🎯 Shot Result
              </h3>
              <label className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.made || false}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, made: e.target.checked }))
                  }
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500 focus:ring-2"
                />
                <span className="font-medium text-gray-700">Made Shot</span>
              </label>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={e => {
              e.preventDefault();
              onSubmit(formData);
            }}
            className="flex-1 py-2 px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            Save Shot
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShotModal;