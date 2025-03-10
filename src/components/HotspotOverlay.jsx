import React, { lazy, Suspense, useState, useEffect } from 'react';
import performerData from './PerformerData';

// Lazy-load the MobilePerformerList component
const MobilePerformerList = lazy(() => import('./MobilePerformerList'));

// Lazy-load the CardDeckHotspot component
const CardDeckHotspot = lazy(() => 
  import('./CardDeckHotspot')
    // Add artificial delay to prevent excessive loading during development
    // Remove the delay in production
    .then(module => {
      if (process.env.NODE_ENV === 'development') {
        return new Promise(resolve => {
          setTimeout(() => resolve(module), 100);
        });
      }
      return module;
    })
);

// Simple loading placeholder
const LoadingPlaceholder = ({ position }) => (
  <div 
    style={{ 
      position: 'absolute',
      left: `${position.x}%`, 
      top: `${position.y}%`,
      transform: 'translate(-50%, -50%)',
      width: '30px',
      height: '30px',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '10px',
      zIndex: 10,
    }}
  />
);

const HotspotOverlay = () => {
  const [adjustedPerformers, setAdjustedPerformers] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect if on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Adjust performer positions for mobile/desktop to prevent overlap
  useEffect(() => {
    // Function to adjust positions to avoid excessive overlap
    const adjustPositions = (performers) => {
      // Clone the performers to avoid mutating the original
      const adjustedPerformers = JSON.parse(JSON.stringify(performers));
      
      // Define area needed for each performer's info box
      // These values will need tweaking based on your actual UI
      const infoWidth = isMobile ? 180 : 150;  // Estimated width of info box
      const infoHeight = isMobile ? 80 : 60;   // Estimated height of info box
      
      // Convert percentage to viewport units for calculations
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      const getPixelX = (percentX) => (percentX * viewportWidth) / 100;
      const getPixelY = (percentY) => (percentY * viewportHeight) / 100;
      const getPercentX = (pixelX) => (pixelX * 100) / viewportWidth;
      const getPercentY = (pixelY) => (pixelY * 100) / viewportHeight;
      
      // Adjust positions if needed
      for (let i = 0; i < adjustedPerformers.length; i++) {
        const performer = adjustedPerformers[i];
        
        // Convert percentage to pixels for easier calculation
        let pixelX = getPixelX(performer.position.x);
        let pixelY = getPixelY(performer.position.y);
        
        // Check left edge - ensure the whole info box fits on screen
        // For mobile, we need to be more conservative since the info is left-aligned
        if (isMobile) {
          // For mobile, info extends more to the left of the performer position
          if (pixelX - (infoWidth * 0.7) < 0) {
            pixelX = infoWidth * 0.7 + 10;  // Add 10px padding
          }
        } else {
          // Desktop version - centered info box
          if (pixelX - (infoWidth / 2) < 0) {
            pixelX = infoWidth / 2 + 10;  // Add 10px padding
          }
        }
        
        // Check right edge
        if (pixelX + (infoWidth / 2) > viewportWidth) {
          pixelX = viewportWidth - (infoWidth / 2) - 10;
        }
        
        // Check top edge - make sure info box has room above
        if (pixelY - infoHeight < 0) {
          pixelY = infoHeight + 10;
        }
        
        // Check overlaps with other performers (already processed)
        for (let j = 0; j < i; j++) {
          const otherPerformer = adjustedPerformers[j];
          const otherPixelX = getPixelX(otherPerformer.position.x);
          const otherPixelY = getPixelY(otherPerformer.position.y);
          
          // Calculate distance between performers
          const xDistance = Math.abs(pixelX - otherPixelX);
          const yDistance = Math.abs(pixelY - otherPixelY);
          
          // Check if overlap is more than allowed (allow 10% overlap)
          const maxOverlapX = infoWidth * 0.9;  // 90% of width = 10% overlap allowed
          const maxOverlapY = infoHeight * 0.9; // 90% of height = 10% overlap allowed
          
          if (xDistance < maxOverlapX && yDistance < maxOverlapY) {
            // Too much overlap, adjust position
            // Move in the direction away from the other performer
            const moveX = (pixelX > otherPixelX) ? 20 : -20;
            const moveY = (pixelY > otherPixelY) ? 20 : -20;
            
            pixelX += moveX;
            pixelY += moveY;
            
            // Re-check bounds after adjustment
            if (pixelX - (infoWidth / 2) < 0) pixelX = infoWidth / 2 + 10;
            if (pixelX + (infoWidth / 2) > viewportWidth) pixelX = viewportWidth - (infoWidth / 2) - 10;
            if (pixelY - infoHeight < 0) pixelY = infoHeight + 10;
          }
        }
        
        // Convert back to percentage
        performer.position.x = getPercentX(pixelX);
        performer.position.y = getPercentY(pixelY);
      }
      
      return adjustedPerformers;
    };
    
    // Run the position adjustment
    setAdjustedPerformers(adjustPositions(performerData));
  }, [isMobile]);
  
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
      <div className="relative w-full h-full pointer-events-auto">
        {adjustedPerformers.map(performer => (
          <Suspense 
            key={performer.id} 
            fallback={<LoadingPlaceholder position={performer.position} />}
          >
            <CardDeckHotspot performer={performer} />
          </Suspense>
        ))}
      </div>
    </div>
  );
};

export default HotspotOverlay;