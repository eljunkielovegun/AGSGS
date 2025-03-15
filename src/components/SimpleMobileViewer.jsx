import React, { useEffect, useState, useRef } from 'react';

const SimpleMobileViewer = ({ 
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
    console.log("Touch start detected");
    setTouchStart(e.touches[0].clientX);
  };
  
  const handleTouchMove = (e) => {
    // Prevent default to avoid scrolling while swiping
    e.preventDefault();
  };
  
  const handleTouchEnd = (e) => {
    console.log("Touch end detected", touchStart);
    if (!touchStart) return;
    
    setTouchEnd(e.changedTouches[0].clientX);
    
    const distance = touchStart - touchEnd;
    console.log("Swipe distance:", distance);
    const isSwipe = Math.abs(distance) > 50;
    
    if (isSwipe) {
      if (distance > 0 && performer?.media && currentMediaIndex < performer.media.length - 1) {
        // Left swipe - next
        console.log("Swiping to next media");
        setCurrentMediaIndex(prev => prev + 1);
      } else if (distance < 0 && currentMediaIndex > 0) {
        // Right swipe - previous
        console.log("Swiping to previous media");
        setCurrentMediaIndex(prev => prev - 1);
      } else {
        // Edge case - close
        console.log("Edge swipe - closing");
        onClose();
      }
    } else {
      // Small movement - close
      console.log("Small movement - closing");
      onClose();
    }
  };
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  // Log current media on render
  console.log("SimpleMobileViewer rendering with media:", currentMedia);
  
  // Extremely minimal UI - no chrome, just the media
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
        touchAction: 'none',
        animation: 'fadeIn 0.2s ease-in'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onClose}
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
          onClick={(e) => {
            e.stopPropagation();
            // Don't close, allow swipe only
          }}
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
          onClick={(e) => {
            e.stopPropagation();
            // Don't close, allow controls to work
          }}
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

export default SimpleMobileViewer;