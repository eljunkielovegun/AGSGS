import React, { useState, useEffect } from 'react';

const StageBackground = ({ children }) => {
  const [viewportDimensions, setViewportDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [isPortrait, setIsPortrait] = useState(window.innerHeight > window.innerWidth);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update dimensions and orientation when window is resized
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewportDimensions({ width, height });
      setIsPortrait(height > width);
      setIsMobile(width < 768);
    };

    // Initial call to set dimensions
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Choose the appropriate background image based on device and orientation
  const getBackgroundImage = () => {
    if (isPortrait && isMobile) {
      return "/images/stage-background-mobile.jpg";
    }
    return "/images/stage-background.jpg";
  };

  // Determine the optimal object-position based on viewport
  const getObjectPosition = () => {
    if (isMobile) {
      if (isPortrait) {
        return 'center center'; // Mobile portrait view
      }
      return 'center 20%'; // Mobile landscape view (focus more on stage center)
    }
    return 'center center'; // Default for desktop
  };

  return (
    <div 
      className="relative overflow-hidden"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1 // Ensure this is behind other elements
      }}
    >
      <img 
        src={getBackgroundImage()}
        alt="Concert stage" 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: getObjectPosition(),
          zIndex: 1
        }}
        onError={(e) => {
          // Background image failed to load, trying fallback
          e.target.onerror = null;
          e.target.src = "/images/stage-background.jpg"; // Fallback to desktop version
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default StageBackground;