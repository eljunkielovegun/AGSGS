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
  const [contentDimensions, setContentDimensions] = useState({ width: 0, height: 0 });
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState(null);
  const [showControls, setShowControls] = useState(true);
  
  const backdropRef = useRef(null);
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
  
  // Handle key presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && performer && performer.media) {
        nextMedia();
      } else if (e.key === 'ArrowLeft' && performer && performer.media) {
        prevMedia();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [onClose, performer]);
  
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

      /* Animation for spinner */
      @keyframes spin {
        0% { transform: translate(-50%, -50%) rotate(0deg); }
        100% { transform: translate(-50%, -50%) rotate(360deg); }
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
    const naturalWidth = target.naturalWidth || 640;
    const naturalHeight = target.naturalHeight || 360;
    
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

// State for vertical swipe handling
const [swipeStartY, setSwipeStartY] = useState(null);
  
// Touch event handlers for swipe navigation
const handleTouchStart = (e) => {
  if (isMobile) {
    setSwipeStartX(e.touches[0].clientX);
    setSwipeStartY(e.touches[0].clientY);
  }
};

const handleTouchEnd = (e) => {
  if (isMobile) {
    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    
    // Calculate horizontal and vertical differences
    const diffX = swipeStartX !== null ? swipeStartX - endX : 0;
    const diffY = swipeStartY !== null ? swipeStartY - endY : 0;
    
    // Determine if swipe is more horizontal or vertical
    const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);
    
    // Only process swipe if it's a significant movement (more than 50px)
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
  }
};
  
  // Event handlers
  const handleClick = (e) => {
    // Handle clicks on the content
    if (e.target.tagName === 'IMG' && 
        !e.target.closest('.play-button') && !e.target.closest('.nav-button') && !e.target.closest('.close-button')) {
      e.stopPropagation();
      
      if (currentMedia.type === 'image') {
        // For images, go to next media
        nextMedia();
      }
    }
    // Close on backdrop click
    else if (e.target === backdropRef.current) {
      onClose();
    }
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
      
      {/* Performer info at top */}
      <div className="modal-info">
        <h2>{performerName}</h2>
        <h3>"{performerPiece}"</h3>
        <p>{performerInstrument}</p>
        
        {performer && performer.media && performer.media.length > 1 && (
          <p className="counter">
            {currentMediaIndex + 1} / {performer.media.length}
            {!isMobile && ` • ${currentMedia.type === 'image' ? 'Click image for next' : 'Use video controls'} • Click outside to close`}
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
          <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* For videos, use iframe to YouTube embed */}
            <iframe
              src={`https://player.cloudinary.com/embed/?cloud_name=demo&public_id=${currentMedia.src.split('/').pop().split('.')[0]}&fluid=true&controls=true&source[source_types][0]=mp4`}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: '#000'
              }}
              allow="autoplay; fullscreen"
              allowFullScreen
            ></iframe>
            
            {/* Direct video link button */}
            <a 
              href={currentMedia.src} 
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
      </div>
      
      {/* Bottom controls for navigation - only show when multiple media items */}
      {performer && performer.media && performer.media.length > 1 && (
        <div className="controls-container">
          <div className="nav-button" onClick={(e) => { e.stopPropagation(); prevMedia(); }}>
            <svg viewBox="0 0 24 24" fill="white">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
            </svg>
          </div>
          
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