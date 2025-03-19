import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

// Custom styles for the carousel with 50% overlap
const customCarouselStyles = `
  .carousel.carousel-slider .slider-wrapper {
    overflow: visible !important;
  }
  
  .carousel .slide {
    transition: opacity 0.5s ease-in-out;
  }
  
  .carousel .slide:not(.selected) {
    opacity: 0.6;
  }
`;
import MediaModal from './MediaModal';

const ImageCarousel = ({ media, performerName, performerInstrument, performerPiece, onClose }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Add custom styles for the carousel
    const styleElement = document.createElement('style');
    styleElement.textContent = customCarouselStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      // Clean up styles when component unmounts
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleMediaClick = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // Make sure we have media
  if (!media || media.length === 0) {
    return (
      <div className="p-3 text-white">
        <p>No media available for this performer</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-3 relative" style={{ height: '100%', zIndex: 50 }}>
        {/* Close button for mobile */}
        {isMobile && onClose && (
          <button 
            onClick={onClose}
            className="absolute top-1 right-1 z-10 w-6 h-6 flex items-center justify-center bg-gray-800 text-white rounded-full"
            aria-label="Close"
          >
            ×
          </button>
        )}
        
        <div className="mb-2" style={{ color: 'white' }}>
          {/* Piece title */}
          <h3 className="text-center mb-1 text-white text-sm italic" style={{ color: 'white' }}>
            "{performerPiece}"
          </h3>
          
          {/* Performer name and instrument */}
          <h4 className="text-center mb-1 text-white font-semibold" style={{ color: 'white' }}>
            {performerName}
          </h4>
          <p className="text-center mb-2 text-gray-300 text-xs" style={{ color: '#d1d5db' }}>
            {performerInstrument}
          </p>
        </div>
        
        <div style={{ height: 'calc(100% - 90px)' }}>
          <Carousel
            showArrows={true}
            showStatus={false}
            showThumbs={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={3000}
            stopOnHover={true}
            swipeable={true}
            emulateTouch={true}
            centerMode={true}
            centerSlidePercentage={50} // Show 50% of adjacent slides
            className="cursor-pointer h-full"
            renderItem={(item, options) => {
              return (
                <div className="carousel-item-wrapper" style={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '0 5px' // Add some spacing between items
                }}>
                  {item}
                </div>
              );
            }}
          >
            {media.map((item, index) => (
              <div 
                key={index} 
                onClick={() => handleMediaClick(item)}
                className="media-container"
                style={{ 
                  height: '100%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  padding: '0 5px',
                  width: '100%' // Ensure the container fills the slide
                }}
              >
                {item.type === 'image' ? (
                  <img 
                    src={item.src} 
                    alt={item.alt || `${performerName} media ${index + 1}`} 
                    style={{ 
                      maxHeight: '100%', 
                      maxWidth: '100%', 
                      objectFit: 'contain'
                    }}
                  />
                ) : item.type === 'video' ? (
                  <div className="relative h-full w-full flex items-center justify-center">
                    <div className="video-thumbnail" style={{ position: 'relative', height: '100%', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* Video thumbnail (using poster image) */}
                      {item.poster ? (
                        <img 
                          src={item.poster}
                          alt={item.alt || "Video thumbnail"}
                          style={{ 
                            maxHeight: '100%', 
                            maxWidth: '100%', 
                            objectFit: 'contain'
                          }}
                        />
                      ) : (
                        <video 
                          src={item.src} 
                          poster={item.poster}
                          muted 
                          playsInline
                          style={{ 
                            maxHeight: '100%', 
                            maxWidth: '100%', 
                            objectFit: 'contain'
                          }}
                        />
                      )}
                      
                      {/* Play button overlay */}
                      <div style={{ 
                        position: 'absolute', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 text-white">Unsupported media type</div>
                )}
              </div>
            ))}
          </Carousel>
        </div>
        <p className="text-center text-white text-xs mt-2" style={{ color: 'white' }}>Click to enlarge</p>
      </div>

      {modalOpen && selectedMedia && (
        <MediaModal 
          media={selectedMedia} 
          onClose={closeModal} 
          performerName={performerName}
          performerPiece={performerPiece}
          performerInstrument={performerInstrument}
        />
      )}
    </>
  );
};

export default ImageCarousel;