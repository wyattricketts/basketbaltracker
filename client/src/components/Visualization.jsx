import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import basketballCourt from '../assets/image.png';

const Visualization = () => {
  const { shots, customParameters } = useAppContext();
  const [selectedSegment, setSelectedSegment] = useState(null);

  // Court segments definition
  const courtSegments = {
    'Paint': { x: [35, 65], y: [70, 100] },
    'Left Corner': { x: [0, 25], y: [85, 100] },
    'Right Corner': { x: [75, 100], y: [85, 100] },
    'Left Wing': { x: [15, 40], y: [50, 85] },
    'Right Wing': { x: [60, 85], y: [50, 85] },
    'Top of Key': { x: [40, 60], y: [50, 70] },
    'Left Elbow': { x: [25, 40], y: [60, 75] },
    'Right Elbow': { x: [60, 75], y: [60, 75] },
    'Mid-Range Left': { x: [10, 35], y: [30, 60] },
    'Mid-Range Right': { x: [65, 90], y: [30, 60] },
    'Three Point Left': { x: [0, 30], y: [0, 50] },
    'Three Point Right': { x: [70, 100], y: [0, 50] },
    'Three Point Top': { x: [30, 70], y: [0, 30] }
  };

  // Function to determine which segment a shot belongs to
  const getShotSegment = (shot) => {
    const { x, y } = shot.coordinates;
    for (const [segmentName, bounds] of Object.entries(courtSegments)) {
      if (x >= bounds.x[0] && x <= bounds.x[1] && y >= bounds.y[0] && y <= bounds.y[1]) {
        return segmentName;
      }
    }
    return 'Other';
  };

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const totalShots = shots.length;
    const madeShots = shots.filter(shot => shot.made).length;
    const missedShots = totalShots - madeShots;
    const shootingPercentage = totalShots ? (madeShots / totalShots) * 100 : 0;

    // Segment analysis
    const segmentStats = {};
    Object.keys(courtSegments).forEach(segment => {
      const segmentShots = shots.filter(shot => getShotSegment(shot) === segment);
      const segmentMade = segmentShots.filter(shot => shot.made).length;
      segmentStats[segment] = {
        total: segmentShots.length,
        made: segmentMade,
        missed: segmentShots.length - segmentMade,
        percentage: segmentShots.length ? (segmentMade / segmentShots.length) * 100 : 0
      };
    });

    // Parameter analysis
    const parameterStats = {};

    // Built-in parameters
    const builtInParams = ['contestLevel', 'shotCreationType', 'defenseType', 'shotType', 'postMove'];
    builtInParams.forEach(param => {
      const values = {};
      shots.forEach(shot => {
        const value = shot[param];
        if (value) {
          if (!values[value]) values[value] = { total: 0, made: 0 };
          values[value].total++;
          if (shot.made) values[value].made++;
        }
      });

      Object.keys(values).forEach(value => {
        values[value].percentage = (values[value].made / values[value].total) * 100;
      });

      parameterStats[param] = values;
    });

    // Custom parameters
    customParameters.forEach(param => {
      const values = {};
      shots.forEach(shot => {
        const value = shot.customFields?.[param.name];
        if (value !== undefined && value !== null) {
          if (!values[value]) values[value] = { total: 0, made: 0 };
          values[value].total++;
          if (shot.made) values[value].made++;
        }
      });

      Object.keys(values).forEach(value => {
        values[value].percentage = (values[value].made / values[value].total) * 100;
      });

      parameterStats[param.name] = values;
    });

    return {
      overall: { totalShots, madeShots, missedShots, shootingPercentage },
      segments: segmentStats,
      parameters: parameterStats
    };
  }, [shots, customParameters]);

  // Enhanced CSV export with multiple sheets
  const handleDownloadAnalysis = () => {
    // Raw Data Sheet
    const rawHeaders = [
      "x", "y", "segment", "contestLevel", "shotCreationType", "defenseType",
      "shotType", "postMove", "dribbleCount", "made",
      ...customParameters.map(param => param.name)
    ];

    const rawRows = shots.map(shot => [
      shot.coordinates.x.toFixed(2),
      shot.coordinates.y.toFixed(2),
      getShotSegment(shot),
      shot.contestLevel || '',
      shot.shotCreationType || '',
      shot.defenseType || '',
      shot.shotType || '',
      shot.postMove || '',
      shot.dribbleCount || 0,
      shot.made ? "Made" : "Missed",
      ...customParameters.map(param => shot.customFields?.[param.name] || '')
    ]);

    // Overall Statistics Sheet
    const overallStatsHeaders = ["Metric", "Value"];
    const overallStatsRows = [
      ["Total Shots", stats.overall.totalShots],
      ["Made Shots", stats.overall.madeShots],
      ["Missed Shots", stats.overall.missedShots],
      ["Shooting Percentage", `${stats.overall.shootingPercentage.toFixed(2)}%`]
    ];

    // Segment Analysis Sheet
    const segmentHeaders = ["Segment", "Total Shots", "Made", "Missed", "Percentage"];
    const segmentRows = Object.entries(stats.segments).map(([segment, data]) => [
      segment,
      data.total,
      data.made,
      data.missed,
      `${data.percentage.toFixed(2)}%`
    ]);

    // Parameter Analysis Sheet
    const paramHeaders = ["Parameter", "Value", "Total Shots", "Made", "Missed", "Percentage"];
    const paramRows = [];
    Object.entries(stats.parameters).forEach(([param, values]) => {
      Object.entries(values).forEach(([value, data]) => {
        paramRows.push([
          param,
          value,
          data.total,
          data.made,
          data.total - data.made,
          `${data.percentage.toFixed(2)}%`
        ]);
      });
    });

    // Combine all sheets into one CSV with separators
    const csvContent = [
      "=== RAW DATA ===",
      rawHeaders.join(","),
      ...rawRows.map(row => row.join(",")),
      "",
      "=== OVERALL STATISTICS ===",
      overallStatsHeaders.join(","),
      ...overallStatsRows.map(row => row.join(",")),
      "",
      "=== SEGMENT ANALYSIS ===",
      segmentHeaders.join(","),
      ...segmentRows.map(row => row.join(",")),
      "",
      "=== PARAMETER ANALYSIS ===",
      paramHeaders.join(","),
      ...paramRows.map(row => row.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "basketball_analysis.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Shot Analysis & Visualization</h1>
          <p className="text-gray-600">Comprehensive basketball performance analytics</p>
        </div>

        {/* Overall Statistics */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Overall Performance</h2>
            <button
              onClick={handleDownloadAnalysis}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              📊 Download Analysis
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{stats.overall.totalShots}</div>
              <div className="text-sm opacity-90">Total Shots</div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{stats.overall.madeShots}</div>
              <div className="text-sm opacity-90">Made Shots</div>
            </div>
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{stats.overall.missedShots}</div>
              <div className="text-sm opacity-90">Missed Shots</div>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl p-4 text-center">
              <div className="text-3xl font-bold">{stats.overall.shootingPercentage.toFixed(1)}%</div>
              <div className="text-sm opacity-90">Shooting %</div>
            </div>
          </div>
        </div>

        {/* Court Visualization */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Court Heat Map</h2>
          <div className="relative">
            <img
              src={basketballCourt}
              alt="Basketball Court"
              className="w-full h-auto object-contain"
            />

            {/* Segment Overlays */}
            {Object.entries(courtSegments).map(([segmentName, bounds]) => {
              const segmentData = stats.segments[segmentName];
              const opacity = segmentData.total > 0 ? Math.min(segmentData.total / 10, 0.8) : 0;
              const color = segmentData.percentage > 50 ? 'bg-green-500' : 'bg-red-500';

              return (
                <div
                  key={segmentName}
                  className={`absolute ${color} cursor-pointer transition-all duration-200 hover:opacity-80`}
                  style={{
                    left: `${bounds.x[0]}%`,
                    top: `${bounds.y[0]}%`,
                    width: `${bounds.x[1] - bounds.x[0]}%`,
                    height: `${bounds.y[1] - bounds.y[0]}%`,
                    opacity: opacity
                  }}
                  onClick={() => setSelectedSegment(segmentName)}
                  title={`${segmentName}: ${segmentData.made}/${segmentData.total} (${segmentData.percentage.toFixed(1)}%)`}
                />
              );
            })}

            {/* Shot Markers */}
            {shots.map((shot, index) => (
              <div
                key={shot.id || index}
                className={`absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${shot.made ? 'bg-green-400 border-green-600' : 'bg-red-400 border-red-600'
                  } border-2`}
                style={{
                  left: `${shot.coordinates.x}%`,
                  top: `${shot.coordinates.y}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Segment Analysis */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Court Segment Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(stats.segments)
              .filter(([_, data]) => data.total > 0)
              .sort((a, b) => b[1].percentage - a[1].percentage)
              .map(([segment, data]) => (
                <div
                  key={segment}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${selectedSegment === segment
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                    }`}
                  onClick={() => setSelectedSegment(selectedSegment === segment ? null : segment)}
                >
                  <h3 className="font-semibold text-gray-800 mb-2">{segment}</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Total:</span>
                      <span className="font-medium">{data.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Made:</span>
                      <span className="font-medium text-green-600">{data.made}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Percentage:</span>
                      <span className={`font-bold ${data.percentage > 50 ? 'text-green-600' : 'text-red-600'}`}>
                        {data.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${data.percentage > 50 ? 'bg-green-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(data.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Parameter Analysis */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Parameter Breakdown</h2>
          <div className="space-y-6">
            {Object.entries(stats.parameters)
              .filter(([_, values]) => Object.keys(values).length > 0)
              .map(([parameter, values]) => (
                <div key={parameter} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 capitalize">
                    {parameter.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.entries(values)
                      .sort((a, b) => b[1].total - a[1].total)
                      .map(([value, data]) => (
                        <div key={value} className="bg-gray-50 rounded-lg p-3">
                          <div className="font-medium text-gray-800 mb-1">{value}</div>
                          <div className="text-sm text-gray-600">
                            {data.made}/{data.total} ({data.percentage.toFixed(1)}%)
                          </div>
                          <div className="mt-1 bg-gray-200 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full ${data.percentage > 50 ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(data.percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Visualization;