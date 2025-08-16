import React from 'react';

const Visualization = ({ shotData }) => {
  const totalShots = shotData.length;
  const madeShots = shotData.filter(shot => shot.made).length;
  const percentageMade = totalShots ? (madeShots / totalShots) * 100 : 0;
  const pointsPerShot = totalShots ? shotData.reduce((acc, shot) => acc + shot.points, 0) / totalShots : 0;

  return (
    <div>
      <h2>Shot Statistics</h2>
      <p>Total Shots: {totalShots}</p>
      <p>Shots Made: {madeShots}</p>
      <p>Percentage Made: {percentageMade.toFixed(2)}%</p>
      <p>Points Per Shot: {pointsPerShot.toFixed(2)}</p>
    </div>
  );
};

export default Visualization;