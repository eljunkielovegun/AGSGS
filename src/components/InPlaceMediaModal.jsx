import React, { useEffect, useState, useRef } from 'react';

const InPlaceMediaModal = ({ 
  media, 
  onClose, 
  performerName, 
  performerPiece, 
  performerInstrument,
  sourcePosition, 
  performer 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [contentDimensions, setContentDimensions] = useState({ width: 0, height: 0 });
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState(null);
  const [showControls, setShowControls] = useState(true);
  
  const backdropRef = useRef(null);
  const videoRef = useRef(null);
  const controlsTimerRef = useRef(null);
  
  // Check device and orientation
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768;
      const landscape = window.innerWidth > window.innerHeight;
      setIsMobile(mobile);
      setIsLandscape(landscape);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);
    
    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
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
          .catch(err => console.error("Error playing video:", err));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  
  // Add CSS to document head
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.85);
        z-index: 9999;
        pointer-events: auto;
        touch-action: pan-y;
      }
      
      .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 10000;
      }
      
      .modal-info {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        text-align: center;
        z-index: 10001;
        padding: 15px;
        background: linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%);
        transition: opacity 0.3s ease;
      }
      
      .modal-info h2 {
        font-size: 24px;
        color: white;
        font-weight: bold;
        margin-bottom: 4px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.9);
      }
      
      .modal-info h3 {
        font-size: 18px;
        color: white;
        font-style: italic;
        margin-bottom: 4px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.9);
      }
      
      .modal-info p {
        font-size: 14px;
        color: rgba(255,255,255,0.9);
        margin-bottom: 8px;
        text-shadow: 0 2px 4px rgba(0,0,0,0.9);
      }
      
      .modal-info .counter {
        font-size: 12px;
        color: rgba(255,255,255,0.7);
        text-shadow: 0 2px 4px rgba(0,0,0,0.9);
      }
      
      .play-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10002;
        transition: background-color 0.3s, opacity 0.3s;
      }
      
      .play-button:hover {
        background-color: rgba(0, 0, 0, 0.7);
      }
      
      .play-button svg {
        width: 24px;
        height: 24px;
        fill: white;
      }
      
      .controls-container {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.5) 70%, rgba(0,0,0,0) 100%);
        z-index: 10001;
        transition: opacity 0.3s ease;
      }
      
      .nav-button {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }
      
      .nav-button svg {
        width: 20px;
        height: 20px;
        fill: white;
      }
      
      .close-button {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 10002;
      }
      
      .close-button svg {
        width: 20px;
        height: 20px;
        fill: white;
      }
      
      @media (max-width: 768px) {
        .modal-info h2 { font-size: 18px; }
        .modal-info h3 { font-size: 16px; }
        .modal-info p { font-size: 12px; }
        .modal-info .counter { font-size: 10px; }
        .play-button {
          width: 50px;
          height: 50px;
        }
        .play-button svg {
          width: 20px;
          height: 20px;
        }
        .nav-button, .close-button {
          width: 36px;
          height: 36px;
        }
        .nav-button svg, .close-button svg {
          width: 16px;
          height: 16px;
        }
      }
      
      @media (max-width: 480px) {
        .modal-info h2 { font-size: 16px; }
        .modal-info h3 { font-size: 14px; }
        .modal-info p { font-size: 10px; }
        .modal-info .counter { font-size: 9px; }
        .play-button {
          width: 40px;
          height: 40px;
        }
        .play-button svg {
          width: 16px;
          height: 16px;
        }
      }
    `;
    
    document.head.appendChild(styleEl);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Handle media load completion with consistent height sizing
  const handleMediaLoaded = (e) => {
    const target = e.target;
    const naturalWidth = target.naturalWidth || target.videoWidth || 640;
    const naturalHeight = target.naturalHeight || target.videoHeight || 360;
    
    // Calculate dimensions
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    
    // Mobile devices need special handling for orientation
    let targetHeight, maxWidth;
    
    if (isMobile) {
      // For mobile, take more screen space
      targetHeight = viewportHeight * (isLandscape ? 0.7 : 0.5);
      maxWidth = viewportWidth * 0.95;
    } else {
      // For desktop, use the original 70% height
      targetHeight = viewportHeight * 0.7;
      maxWidth = viewportWidth * 0.9;
    }
    
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
    setIsLoading(false);
  };

  // Touch event handlers for swipe navigation
  const handleTouchStart = (e) => {
    if (isMobile && performer && performer.media && performer.media.length > 1) {
      setSwipeStartX(e.touches[0].clientX);
      resetControlsTimer();
    }
  };
  
  const handleTouchEnd = (e) => {
    if (isMobile && swipeStartX !== null && performer && performer.media && performer.media.length > 1) {
      const endX = e.changedTouches[0].clientX;
      const diff = swipeStartX - endX;
      
      // Only process swipe if it's a significant movement (more than 50px)
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe left - go to next
          nextMedia();
        } else {
          // Swipe right - go to previous
          prevMedia();
        }
      }
      
      setSwipeStartX(null);
    }
  };
  
  // Event handlers
  const handleClick = (e) => {
    // Reset controls timer on any click
    resetControlsTimer();
    
    // Handle clicks on the content
    if ((e.target.tagName === 'IMG' || e.target.tagName === 'VIDEO') && 
        !e.target.closest('.play-button') && !e.target.closest('.nav-button') && !e.target.closest('.close-button')) {
      e.stopPropagation();
      
      // Toggle controls visibility on content tap for mobile
      if (isMobile) {
        setShowControls(!showControls);
      } else if (currentMedia.type === 'video') {
        // For desktop, toggle play/pause on video click
        togglePlayPause();
      } else {
        // For images on desktop, go to next media
        nextMedia();
      }
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

  return (
    <div 
      className="modal-backdrop" 
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
            width: '48px',
            height: '48px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '50%',
            borderTop: '4px solid white',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      )}
      
      {/* Close button (always visible) */}
      <div 
        className="close-button"
        onClick={onClose}
      >
        <svg viewBox="0 0 24 24" fill="white">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </div>
      
      {/* Performer info at top - collapsible on mobile */}
      <div className="modal-info" style={{
        opacity: showControls || !isPlaying ? 1 : 0,
        pointerEvents: showControls || !isPlaying ? 'auto' : 'none'
      }}>
        <h2>{performerName}</h2>
        <h3>"{performerPiece}"</h3>
        <p>{performerInstrument}</p>
        
        {performer && performer.media && performer.media.length > 1 && (
          <p className="counter">
            {currentMediaIndex + 1} / {performer.media.length}
            {!isMobile && ` • ${currentMedia.type === 'image' ? 'Click image for next' : 'Space to play/pause'} • Click outside to close`}
            {isMobile && ` • Swipe to navigate`}
          </p>
        )}
      </div>
      
      {/* Media content - centered in viewport */}
      <div className="modal-content" style={{
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
            <video 
              ref={videoRef}
              src={currentMedia.src} 
              playsInline // Important for mobile
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                cursor: 'pointer'
              }}
              onLoadedData={handleMediaLoaded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            />
            {/* Play/pause button overlay for videos - only show when controls are visible */}
            {(showControls || !isPlaying) && (
              <div 
                className="play-button"
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
        <div className="controls-container" style={{
          opacity: showControls || !isPlaying ? 1 : 0,
          pointerEvents: showControls || !isPlaying ? 'auto' : 'none'
        }}>
          <div className="nav-button" onClick={(e) => { e.stopPropagation(); prevMedia(); }}>
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </div>
          
          {currentMedia.type === 'video' && (
            <div className="nav-button" onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}>
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
          
          <div className="nav-button" onClick={(e) => { e.stopPropagation(); nextMedia(); }}>
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default InPlaceMediaModal;