import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MediaModal = ({ media, onClose, performerName, performerPiece, performerInstrument }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoPreloaded, setVideoPreloaded] = useState(false);
  const videoRef = useRef(null);
  
  // Preload video when component mounts
  const preloadVideo = useCallback(() => {
    if (media.type === 'video' && !videoPreloaded) {
      // Create a preload link
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'preload';
      preloadLink.as = 'video';
      preloadLink.href = media.src;
      document.head.appendChild(preloadLink);
      
      // Create a hidden video element to preload the video
      const hiddenVideo = document.createElement('video');
      hiddenVideo.preload = 'auto';
      hiddenVideo.src = media.src;
      hiddenVideo.style.display = 'none';
      hiddenVideo.muted = true;
      hiddenVideo.onloadeddata = () => {
        console.log('Video preloaded:', media.src);
        setVideoPreloaded(true);
        document.body.removeChild(hiddenVideo);
      };
      document.body.appendChild(hiddenVideo);
    }
  }, [media, videoPreloaded]);
  
  // Attempt to preload the video
  useEffect(() => {
    if (media.type === 'video') {
      preloadVideo();
    }
  }, [media, preloadVideo]);
  
  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === ' ' && media.type === 'video') {
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
    if (!videoRef.current) return;
    
    try {
      if (videoRef.current.paused) {
        const playPromise = videoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch(err => {
              console.error("Error playing video:", err);
              // Show error message instead of attempting autoplay
              setIsPlaying(false);
            });
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Exception in togglePlayPause:", error);
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
                className="max-w-full max-h-full"
                onLoadedData={handleMediaLoaded}
                onError={(e) => console.error("Video error:", e)}
                style={{ opacity: isLoading ? 0.5 : 1 }}
                poster={media.poster}
                playsInline
                preload="auto"
                loop={false}
                muted={false}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              >
                <source 
                  src={`${media.src}?cache=${new Date().getTime()}`} 
                  type={media.src.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 'video/quicktime'}
                />
              </video>
              
              {/* Play button for videos */}
              {!isPlaying && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60px',
                    height: '60px',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePlayPause();
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
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