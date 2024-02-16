// StatBar.jsx
import React from 'react';

//css
import './StatBar.css';

const StatBar = ({ label, value, max }) => {
  const percentage = (value / max) * 100;

  return (
    <div className='stat-bar'>
      <p className='stat-label'>{label}</p>
      <div className='stat-fill' style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

export default StatBar;
