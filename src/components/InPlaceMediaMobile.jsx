import React, { useEffect, useState, useRef } from 'react';

const InPlaceMediaMobile = ({ 
  media, 
  onClose, 
  performer 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const videoRef = useRef(null);
  
  // Find initial media index
  useEffect(() => {
    if (performer && performer.media) {
      const index = performer.media.findIndex(item => 
        item.src === media.src && item.type === media.type);
      if (index !== -1) {
        setCurrentMediaIndex(index);
      }
    }
  }, [media, performer]);

  // Get current media
  const currentMedia = performer && performer.media && performer.media.length > 0
    ? performer.media[currentMediaIndex]
    : media;
  
  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    setTouchEnd(e.changedTouches[0].clientX);
    
    const distance = touchStart - touchEnd;
    const isSwipe = Math.abs(distance) > 50;
    
    if (isSwipe) {
      if (distance > 0 && performer?.media && currentMediaIndex < performer.media.length - 1) {
        // Left swipe - next
        setCurrentMediaIndex(prev => prev + 1);
      } else if (distance < 0 && currentMediaIndex > 0) {
        // Right swipe - previous
        setCurrentMediaIndex(prev => prev - 1);
      } else {
        // Edge case - close
        onClose();
      }
    } else {
      // Small movement - close
      onClose();
    }
  };
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  // Extremely minimal UI
  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        touchAction: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {currentMedia.type === 'image' ? (
        <img
          src={currentMedia.src}
          alt="Media"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
          onLoad={handleLoad}
        />
      ) : (
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
          onLoadedData={handleLoad}
        >
          <source src={currentMedia.src} type="video/mp4" />
        </video>
      )}
      
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <div style={{
            width: '30px',
            height: '30px',
            border: '3px solid rgba(255,255,255,0.2)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}
    </div>
  );
};

export default InPlaceMediaMobile;