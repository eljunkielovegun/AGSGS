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
              loading="lazy"
            />
          ) : (
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              {/* Use iframe for more reliable video playback */}
              <iframe
                src={`https://player.cloudinary.com/embed/?cloud_name=demo&public_id=${media.src.split('/').pop().split('.')[0]}&fluid=true&controls=true&source[source_types][0]=mp4`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  backgroundColor: '#000'
                }}
                allow="autoplay; fullscreen"
                allowFullScreen
                onLoad={handleMediaLoaded}
              ></iframe>
              
              {/* Direct video link */}
              <a 
                href={media.src} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '5px 10px',
                  fontSize: '12px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  zIndex: 100
                }}
                onClick={e => e.stopPropagation()}
              >
                Direct Link
              </a>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(MediaModal);