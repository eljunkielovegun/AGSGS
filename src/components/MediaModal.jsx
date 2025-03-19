import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MediaModal = ({ media, onClose, performerName, performerPiece, performerInstrument }) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      // Restore body scroll
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  // Handle media load completion
  const handleMediaLoaded = () => {
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div 
        className="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Loading spinner - only shown while media is loading */}
        {isLoading && (
          <div className="loading-spinner-container">
            <div className="loading-spinner"></div>
          </div>
        )}
        
        {/* Information overlay */}
        <div className="absolute top-4 left-4 z-10 p-4 bg-black bg-opacity-70 rounded-lg max-w-md">
          <h2 className="modal-title">{performerName}</h2>
          <h3 className="modal-subtitle">{performerPiece}</h3>
          <p className="performer-instrument">{performerInstrument}</p>
        </div>
        
        <div className="close-button" onClick={onClose}>×</div>
        
        <motion.div 
          className="modal-content"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: isLoading ? 0.3 : 1 
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          {media.type === 'image' ? (
            <img 
              src={media.src} 
              alt={media.alt} 
              className="max-w-full max-h-full"
              onLoad={handleMediaLoaded}
              style={{ opacity: isLoading ? 0.5 : 1 }}
              // Add loading="lazy" for modern browsers
              loading="lazy"
            />
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {/* Show poster image */}
              {media.poster && (
                <img 
                  src={media.poster}
                  alt={media.alt || "Video thumbnail"}
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    opacity: 0.8
                  }}
                />
              )}
              
              {/* Information overlay */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
                maxWidth: '80%'
              }}>
                <h3 style={{marginBottom: '15px'}}>Video playback is available by clicking below</h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                  justifyContent: 'center',
                  gap: '10px'
                }}>
                  {/* Direct link button */}
                  <a 
                    href={media.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#2196f3',
                      color: 'white',
                      padding: '10px 15px',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      fontWeight: 'bold'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Open Video in New Tab
                  </a>
                  
                  {/* Download button */}
                  <a 
                    href={media.src}
                    download
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#4caf50',
                      color: 'white',
                      padding: '10px 15px',
                      borderRadius: '5px',
                      textDecoration: 'none',
                      fontWeight: 'bold'
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Download Video
                  </a>
                </div>
                
                <p style={{marginTop: '15px', fontSize: '14px'}}>
                  Note: The video may not play directly in this view on some devices.
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(MediaModal);