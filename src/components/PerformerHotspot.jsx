import React, { useState, useEffect } from 'react';
import ImageCarousel from './ImageCarousel';

const PerformerHotspot = ({ performer }) => {
  const { position, size, color, name, piece, instrument, media, carouselPosition = 'bottom' } = performer;
  const [showCarousel, setShowCarousel] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Get first letter of first name for the hotspot
  const firstInitial = name.split(' ')[0][0];
  
  // Handle click for mobile devices
  const handleClick = () => {
    if (isMobile) {
      setShowCarousel(!showCarousel);
    }
  };

  // Simple position calculations based on carouselPosition
  const getCarouselStyles = () => {
    const baseStyles = {
      position: 'absolute',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderRadius: '8px',
      boxShadow: isHovered ? '0 8px 40px rgba(0, 0, 0, 0.7)' : '0 4px 30px rgba(0, 0, 0, 0.5)',
      transition: 'box-shadow 0.3s, z-index 0s',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      zIndex: isHovered ? 60 : 30, // Significantly higher z-index when hovered
      width: isMobile ? '280px' : '350px',
      height: isMobile ? '230px' : '250px',
    };

    // Position based on carouselPosition
    switch(carouselPosition) {
      case 'top':
        return {
          ...baseStyles,
          bottom: size + 10,
          left: '50%',
          transform: 'translateX(-50%)',
        };
      case 'right':
        return {
          ...baseStyles,
          left: size/2 + 10,
          top: '0',
          transform: 'translateY(-50%)',
        };
      case 'left':
        return {
          ...baseStyles,
          right: size/2 + 10,
          top: '0',
          transform: 'translateY(-50%)',
        };
      case 'bottom':
      default:
        return {
          ...baseStyles,
          top: size/2 + 10,
          left: '50%',
          transform: 'translateX(-50%)',
        };
    }
  };

  return (
    // This outer div controls the absolute positioning on the page
    <div 
      style={{ 
        position: 'absolute',
        left: `${position.x}%`, 
        top: `${position.y}%`,
        zIndex: 10,
        transform: 'translate(-50%, -50%)', // Center the container
        width: 0, // Container doesn't take space
        height: 0, // Container doesn't take space
      }}
    >
      {/* Container for both hotspot and carousel with hover detection */}
      <div
        onMouseEnter={() => {
          if (!isMobile) {
            setShowCarousel(true);
            setIsHovered(true);
          }
        }}
        onMouseLeave={() => {
          if (!isMobile) {
            setShowCarousel(false);
            setIsHovered(false);
          }
        }}
        style={{ 
          position: 'relative',
          zIndex: isHovered ? 40 : 10 // Increase parent z-index when hovered
        }}
      >
        {/* Hotspot */}
        <div 
          onClick={handleClick}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: color,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: isHovered ? '0 0 15px rgba(0, 0, 0, 0.6)' : '0 0 10px rgba(0, 0, 0, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.8)',
            position: 'absolute',
            top: -size/2, // Center the hotspot
            left: -size/2, // Center the hotspot
            zIndex: isHovered ? 50 : 20, // Increase z-index when hovered
            transition: 'transform 0.3s, box-shadow 0.3s, z-index 0s',
            transform: isHovered ? 'scale(1.2)' : 'scale(1)', // Grow by 20% when hovered
          }}
          className="hotspot"
          title={`${name} - ${instrument}`}
        >
          <span>{firstInitial}</span>
        </div>
        
        {/* Carousel - conditionally rendered based on hover/click state */}
        {showCarousel && (
          <div style={getCarouselStyles()}>
            <ImageCarousel 
              media={media} 
              performerName={name} 
              performerInstrument={instrument}
              performerPiece={piece}
              onClose={isMobile ? () => setShowCarousel(false) : null}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformerHotspot;