
import React, { useEffect, useState, useRef } from 'react';

const InPlaceMediaMobile = ({ 
  media, 
  onClose, 
  performerName, 
  performerPiece, 
  performerInstrument,
  sourcePosition, 
  performer 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [contentDimensions, setContentDimensions] = useState({ width: 0, height: 0 });
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isLandscape, setIsLandscape] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState(null);
  const [swipeStartY, setSwipeStartY] = useState(null);
  const [showControls, setShowControls] = useState(true);
  
  const backdropRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimerRef = useRef(null);
  
  // Check orientation
  useEffect(() => {
    const checkOrientation = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);
  
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
  
  // Reset playing state when media changes
  useEffect(() => {
    setIsPlaying(false);
  }, [currentMediaIndex, currentMedia]);
  
  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && performer && performer.media) {
        nextMedia();
      } else if (e.key === 'ArrowLeft' && performer && performer.media) {
        prevMedia();
      } else if (e.key === ' ' && currentMedia.type === 'video' && videoRef.current) {
        // Space bar toggles play/pause for videos
        e.preventDefault();
        togglePlayPause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, performer, currentMedia.type]);
  
  // Handle controls auto-hide timer
  useEffect(() => {
    if (isPlaying) {
      // Start timer to hide controls
      resetControlsTimer();
    } else {
      // Show controls when paused
      setShowControls(true);
      clearTimeout(controlsTimerRef.current);
    }
    
    return () => clearTimeout(controlsTimerRef.current);
  }, [isPlaying]);
  
  // Set a timeout for media loading
  useEffect(() => {
    const loadTimeout = setTimeout(() => {
      if (isLoading) {
        console.warn("Media loading timed out");
        setLoadError(true);
        setIsLoading(false);
      }
    }, 15000); // 15 second timeout
    
    return () => clearTimeout(loadTimeout);
  }, [isLoading]);
  
  // Reset the controls auto-hide timer
  const resetControlsTimer = () => {
    clearTimeout(controlsTimerRef.current);
    setShowControls(true);
    
    controlsTimerRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000); // Hide controls after 3 seconds
  };
  
  // Navigation functions
  const nextMedia = () => {
    if (performer && performer.media && performer.media.length > 1) {
      setCurrentMediaIndex((prev) => 
        (prev + 1) % performer.media.length);
    }
  };
  
  const prevMedia = () => {
    if (performer && performer.media && performer.media.length > 1) {
      setCurrentMediaIndex((prev) => 
        prev > 0 ? prev - 1 : performer.media.length - 1);
    }
  };
  
  // Toggle play/pause for videos
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error("Error playing video:", err);
            setLoadError(true);
          });
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  
  // Handle media load errors
  const handleMediaError = (e) => {
    console.error("Error loading media:", e);
    setLoadError(true);
    setIsLoading(false);
  };
  
  // Handle media load completion with optimized sizing for mobile
  const handleMediaLoaded = (e) => {
    const target = e.target;
    const naturalWidth = target.naturalWidth || target.videoWidth || 640;
    const naturalHeight = target.naturalHeight || target.videoHeight || 360;
    
    // Calculate dimensions optimized for mobile
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // For mobile, take more screen space based on orientation
    const targetHeight = viewportHeight * (isLandscape ? 0.85 : 0.65);
    const maxWidth = viewportWidth * 0.95;
    
    let width, height;
    const aspectRatio = naturalWidth / naturalHeight;
    
    // Always set height to target height percent of viewport height
    height = targetHeight;
    width = height * aspectRatio;
    
    // But if width exceeds maximum allowable width, recalculate
    if (width > maxWidth) {
      width = maxWidth;
      height = width / aspectRatio;
    }
    
    setContentDimensions({ width, height });
    setLoadError(false);
    setIsLoading(false);
  };

  // Touch event handlers for swipe navigation and closing
  const handleTouchStart = (e) => {
    setSwipeStartX(e.touches[0].clientX);
    setSwipeStartY(e.touches[0].clientY);
    resetControlsTimer();
  };
  
  const handleTouchEnd = (e) => {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    // Calculate horizontal and vertical differences
    const diffX = swipeStartX !== null ? swipeStartX - endX : 0;
    const diffY = swipeStartY !== null ? swipeStartY - endY : 0;
    
    // Determine if swipe is more horizontal or vertical
    const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
    
    // Only process swipe if it's a significant movement
    if (isHorizontalSwipe) {
      // Process horizontal swipes for navigation
      if (Math.abs(diffX) > 50 && performer && performer.media && performer.media.length > 1) {
        if (diffX > 0) {
          // Swipe left - go to next
          nextMedia();
        } else {
          // Swipe right - go to previous
          prevMedia();
        }
      }
    } else {
      // Process vertical swipes
      if (diffY < -80) { // Negative means upward swipe (threshold of 80px)
        // Swipe up - close modal
        onClose();
      }
    }
    
    setSwipeStartX(null);
    setSwipeStartY(null);
  };
  
  // Event handler for taps/clicks
  const handleClick = (e) => {
    // Reset controls timer on any click
    resetControlsTimer();
    
    // Handle clicks on the content
    if ((e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') && 
        !e.target.closest('.play-button') && !e.target.closest('.nav-button') && !e.target.closest('.close-button')) {
      e.stopPropagation();
      
      // Toggle controls visibility on content tap
      setShowControls(!showControls);
    }
    // Close on backdrop click
    else if (e.target === backdropRef.current) {
      onClose();
    }
  };
  
  // Handle play button click
  const handlePlayClick = (e) => {
    e.stopPropagation(); // Prevent navigation
    togglePlayPause();
    resetControlsTimer();
  };

  // Add CSS for mobile-optimized modal
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .mobile-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.95);
        z-index: 9999;
        pointer-events: auto;
        touch-action: pan-y;
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }
      
      .mobile-modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
      }
      
      .mobile-modal-info {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        z-index: 10001;
        padding: 12px;
        background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%);
        transition: opacity 0.3s ease;
      }
      
      .mobile-modal-info h2 {
        font-size: 18px;
        color: white;
        font-weight: bold;
        margin-bottom: 4px;
        text-shadow: 0 2px 3px rgba(0,0,0,0.9);
      }
      
      .mobile-modal-info h3 {
        font-size: 16px;
        color: white;
        font-style: italic;
        margin-bottom: 4px;
        text-shadow: 0 2px 3px rgba(0,0,0,0.9);
      }
      
      .mobile-modal-info p {
        font-size: 12px;
        color: rgba(255,255,255,0.9);
        margin-bottom: 6px;
        text-shadow: 0 2px 3px rgba(0,0,0,0.9);
      }
      
      .mobile-modal-info .counter {
        font-size: 10px;
        color: rgba(255,255,255,0.7);
        text-shadow: 0 2px 3px rgba(0,0,0,0.9);
      }
      
      .mobile-play-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 52px;
        height: 52px;
        background-color: rgba(0, 0, 0, 0.6);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10002;
        transition: background-color 0.3s, opacity 0.3s;
      }
      
      .mobile-play-button svg {
        width: 24px;
        height: 24px;
        fill: white;
      }
      
      .mobile-controls-container {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0) 100%);
        z-index: 10001;
        transition: opacity 0.3s ease;
      }
      
      .mobile-nav-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      
      .mobile-nav-button svg {
        width: 20px;
        height: 20px;
        fill: white;
      }
      
      .mobile-close-button {
        position: absolute;
        top: 12px;
        right: 12px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10002;
        -webkit-tap-highlight-color: transparent;
      }
      
      .mobile-close-button svg {
        width: 20px;
        height: 20px;
        fill: white;
      }
      
      /* Handle smaller screens */
      @media (max-width: 480px) {
        .mobile-modal-info h2 { font-size: 16px; }
        .mobile-modal-info h3 { font-size: 14px; }
        .mobile-modal-info p { font-size: 10px; }
        .mobile-modal-info .counter { font-size: 9px; }
        .mobile-play-button {
          width: 44px;
          height: 44px;
        }
        .mobile-play-button svg {
          width: 18px;
          height: 18px;
        }
      }
      
      /* Landscape orientation adjustments */
      @media (orientation: landscape) {
        .mobile-modal-info {
          padding: 8px;
        }
        .mobile-modal-info h2 { font-size: 15px; margin-bottom: 2px; }
        .mobile-modal-info h3 { font-size: 13px; margin-bottom: 2px; }
        .mobile-modal-info p { font-size: 9px; margin-bottom: 2px; }
        .mobile-controls-container {
          padding: 8px;
        }
        .mobile-nav-button {
          width: 36px;
          height: 36px;
        }
      }
    `;
    
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div 
      className="mobile-modal-backdrop" 
      ref={backdropRef}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Loading spinner */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            borderTop: '3px solid white',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      )}
      
      {/* Close button (always visible) */}
      <div 
        className="mobile-close-button"
        onClick={onClose}
      >
        <svg viewBox="0 0 24 24" fill="white">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </div>
      
      {/* Performer info at top */}
      <div className="mobile-modal-info" style={{
        opacity: showControls || !isPlaying ? 1 : 0,
        pointerEvents: showControls || !isPlaying ? 'auto' : 'none'
      }}>
        <h2>{performerName}</h2>
        <h3>"{performerPiece}"</h3>
        <p>{performerInstrument}</p>
        
        {performer && performer.media && performer.media.length > 1 && (
          <p className="counter">
            {currentMediaIndex + 1} / {performer.media.length}
            • Swipe left/right to navigate • Swipe up to close
          </p>
        )}
      </div>
      
      {/* Media content - centered in viewport */}
      <div className="mobile-modal-content" style={{
        width: contentDimensions.width,
        height: contentDimensions.height,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}>
        {currentMedia.type === 'image' ? (
          <img 
            src={currentMedia.src} 
            alt={currentMedia.alt || performerName}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              cursor: 'pointer'
            }}
            onLoad={handleMediaLoaded}
          />
        ) : (
          <>
            {loadError ? (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#111',
                color: 'white',
                padding: '20px',
                textAlign: 'center'
              }}>
                <svg viewBox="0 0 24 24" width="40" height="40" fill="white" style={{marginBottom: '12px'}}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
                <h3 style={{marginBottom: '8px'}}>Video couldn't be loaded</h3>
                <p style={{fontSize: '12px', opacity: 0.8}}>
                  Check your connection or try again later
                </p>
                <button 
                  style={{
                    marginTop: '16px',
                    padding: '8px 16px',
                    background: 'rgba(255,255,255,0.2)',
                    border: 'none',
                    borderRadius: '4px',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    setLoadError(false);
                    setIsLoading(true);
                    // Force reload of the video
                    if (videoRef.current) {
                      videoRef.current.load();
                    }
                  }}
                >
                  Try Again
                </button>
              </div>
            ) : (
              <video 
                ref={videoRef}
                src={currentMedia.src}
                preload="auto" 
                playsInline={true}
                muted={false}
                controls={false}
                webkit-playsinline="true"
                x5-playsinline="true"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  cursor: 'pointer'
                }}
                onLoadedData={handleMediaLoaded}
                onError={handleMediaError}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
              />
            )}
            
            {/* Play/pause button overlay for videos - only show when controls are visible */}
            {!loadError && (showControls || !isPlaying) && (
              <div 
                className="mobile-play-button"
                onClick={handlePlayClick}
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="white">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            )}
          </>
        )}
      </div>
      
      {/* Bottom controls for navigation - only show when multiple media items */}
      {performer && performer.media && performer.media.length > 1 && (
        <div className="mobile-controls-container" style={{
          opacity: showControls || !isPlaying ? 1 : 0,
          pointerEvents: showControls || !isPlaying ? 'auto' : 'none'
        }}>
          <div className="mobile-nav-button" onClick={(e) => { e.stopPropagation(); prevMedia(); }}>
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </div>
          
          {currentMedia.type === 'video' && (
            <div className="mobile-nav-button" onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}>
              {isPlaying ? (
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="white">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </div>
          )}
          
          <div className="mobile-nav-button" onClick={(e) => { e.stopPropagation(); nextMedia(); }}>
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default InPlaceMediaMobile;