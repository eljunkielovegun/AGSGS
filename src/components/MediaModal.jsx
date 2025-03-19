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
  
  // Toggle play/pause for videos with improved error handling
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        // Make sure video is fully loaded before playing
        const playVideo = () => {
          // Make sure the element is still in the DOM
          if (videoRef.current && document.contains(videoRef.current)) {
            videoRef.current.play()
              .then(() => setIsPlaying(true))
              .catch(err => {
                console.error("Error playing video:", err);
                // If there's an abort error, wait and try again
                if (err.name === 'AbortError') {
                  console.log("Retrying playback after abort...");
                  setTimeout(playVideo, 500); // Retry after 500ms
                }
              });
          }
        };
        
        // Short delay to ensure DOM is ready before playing
        setTimeout(playVideo, 100);
      } else {
        if (videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
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
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <video 
                ref={videoRef}
                controls 
                playsInline
                className="max-w-full max-h-full"
                onLoadedData={handleMediaLoaded}
                onError={(e) => {
                  console.error("Video error:", e);
                  // Prevent default error handling
                  e.preventDefault();
                }}
                style={{ opacity: isLoading ? 0.5 : 1 }}
                poster={media.poster || ''}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                preload="auto"
              >
                <source 
                  src={`${media.src}?v=${new Date().getTime()}`} 
                  type={media.src.endsWith('.mp4') ? 'video/mp4' : 'video/quicktime'} 
                />
              </video>
              
              {/* Loading message if needed */}
              {isLoading && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '15px',
                  borderRadius: '4px',
                  textAlign: 'center'
                }}>
                  <p>Loading video...</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default React.memo(MediaModal);