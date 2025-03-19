import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MediaModal = ({ media, onClose, performerName, performerPiece, performerInstrument }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' && media.type === 'video' && videoRef.current) {
        // Space bar toggles play/pause for videos
        e.preventDefault();
        togglePlayPause();
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
  }, [onClose, media.type]);

  // Handle media load completion
  const handleMediaLoaded = () => {
    setIsLoading(false);
  };
  
  // Toggle play/pause for videos
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.error("Error playing video:", err));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
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
            <video 
              ref={videoRef}
              controls 
              playsInline
              className="max-w-full max-h-full"
              onLoadedData={handleMediaLoaded}
              onError={(e) => console.error("Video error:", e)}
              style={{ opacity: isLoading ? 0.5 : 1 }}
              poster={media.poster || ''}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            >
              <source src={media.src} type={media.src.endsWith('.mp4') ? 'video/mp4' : 'video/quicktime'} />
            </video>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(MediaModal);