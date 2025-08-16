import React, { useState } from 'react';

export default function DataEntry() {
  const [shotData, setShotData] = useState({
    shotType: '',
    distance: '',
    made: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setShotData({
      ...shotData,
      [name]: name === 'made' ? e.target.checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic to handle shot data submission
    console.log('Shot Data Submitted:', shotData);
    // Reset form after submission
    setShotData({ shotType: '', distance: '', made: false });
  };

  return (
    <div>
      <h2>Input Basketball Shot Data</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Shot Type:
            <select name="shotType" value={shotData.shotType} onChange={handleChange}>
              <option value="">Select</option>
              <option value="freeThrow">Free Throw</option>
              <option value="twoPointer">Two Pointer</option>
              <option value="threePointer">Three Pointer</option>
            </select>
          </label>
        </div>
        <div>
          <label>
            Distance (in feet):
            <input
              type="number"
              name="distance"
              value={shotData.distance}
              onChange={handleChange}
            />
          </label>
        </div>
        <div>
          <label>
            Made:
            <input
              type="checkbox"
              name="made"
              checked={shotData.made}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit">Submit Shot Data</button>
      </form>
    </div>
  );
}