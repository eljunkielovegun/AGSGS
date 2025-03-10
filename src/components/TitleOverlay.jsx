import React from 'react';

const TitleOverlay = () => {
  return (
    <div 
      className="fixed top-4 left-4 z-50 p-5 bg-black bg-opacity-80 rounded-lg" 
      style={{ 
        maxWidth: '300px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)'
      }}
    >
      <h1 
        className="text-white font-bold text-2xl mb-1" 
        style={{ letterSpacing: '1.5px', textTransform: 'uppercase' }}
      >
        REMLABS
      </h1>
      
      <p className="text-gray-300 text-sm mb-3">
        Adventurous Electric Guitar
      </p>
      
      <div className="mb-3">
        <img 
          src="/REMLABS-Guitar.png" 
          alt="REMLABS Guitar" 
          className="max-w-full h-auto"
          style={{ maxHeight: '80px' }}
          onError={(e) => {
            console.log("Image failed to load, trying alternative path");
            e.target.onerror = null;
            e.target.src = "/images/REMLABS-Guitar.png";
          }}
        />
      </div>
      
      <p className="text-gray-400 text-xs">
        Hover over performers to explore media
      </p>
    </div>
  );
};

export default TitleOverlay;