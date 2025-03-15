import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import InPlaceMediaModal from './InPlaceMediaModal';

// Card component with hover support
const Card = ({ 
  index, 
  mediaItem, 
  totalCards, 
  isHovered,
  selectedIndex, 
  color,
  onClick,
  onMouseEnter
}) => {
  // Create styles based on hover state
  let style = {
    position: 'absolute',
    width: '80px',
    height: '120px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
    cursor: 'pointer',
    transformOrigin: 'bottom center',
    willChange: 'transform',
  };
  
  // Add background
  if (mediaItem && mediaItem.type === 'image') {
    style.backgroundImage = `url(${mediaItem.src})`;
    style.backgroundSize = 'cover';
    style.backgroundPosition = 'center';
  } else {
    style.backgroundColor = '#111';
  }
  
  // Apply different styles based on hover state
  if (isHovered) {
    if (index === selectedIndex) {
      // Selected card
      style.transform = 'translateX(0) rotate(0deg) scale(1.1)';
      style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.3)';
      style.border = `2px solid ${color}`;
      style.zIndex = 100;
    } else if (index < selectedIndex) {
      // Cards to the left
      const offset = (selectedIndex - index) * 30;
      style.transform = `translateX(-${offset}px) rotate(0deg)`;
      style.zIndex = 10 + index;
    } else {
      // Cards to the right
      const offset = (index - selectedIndex) * 30;
      style.transform = `translateX(${offset}px) rotate(0deg)`;
      style.zIndex = 10 + (totalCards - index);
    }
  } else {
    // Default fanned appearance
    const baseRotation = -10;
    const rotationIncrement = 20 / (totalCards - 1 || 1);
    const rotation = baseRotation + (index * rotationIncrement);
    style.transform = `rotate(${rotation}deg) translateY(${index * 3}px)`;
    style.zIndex = index;
  }
  
  return (
    <div
      style={style}
      onClick={() => onClick(mediaItem, index)}
      onMouseEnter={() => onMouseEnter(index)}
    >
      {/* Card label on the bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        fontSize: '8px',
        padding: '2px',
        textAlign: 'center',
        borderBottomLeftRadius: '6px',
        borderBottomRightRadius: '6px'
      }}>
        {index + 1}/{totalCards}
      </div>
      
      {/* Play icon for videos */}
      {mediaItem && mediaItem.type === 'video' && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
    </div>
  );
};

const CardDeckHotspot = ({ performer }) => {
  const { position, color, name, piece, instrument, media } = performer;
  const [isHovered, setIsHovered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [sourcePosition, setSourcePosition] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs for DOM access
  const cardsRef = useRef(null);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  // Create modal root for portals
  useEffect(() => {
    // Create portal container for modals if it doesn't exist
    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      modalRoot.style.position = 'fixed';
      modalRoot.style.top = '0';
      modalRoot.style.left = '0';
      modalRoot.style.width = '100%';
      modalRoot.style.height = '100%';
      modalRoot.style.zIndex = '9999';
      modalRoot.style.pointerEvents = 'none';
      document.body.appendChild(modalRoot);
    }
    
    return () => {
      const modalRoot = document.getElementById('modal-root');
      if (modalRoot && !modalRoot.hasChildNodes()) {
        document.body.removeChild(modalRoot);
      }
    };
  }, []);
  
  // Detect if component is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });
    
    const element = document.getElementById(`card-deck-${performer.id}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => observer.disconnect();
  }, [performer.id]);
  
  // Get media with fallback
  const performerMedia = media && media.length > 0 
    ? media 
    : [{ type: 'image', src: '/images/performers/misc/Audience.jpg', alt: 'Performer' }];
  
  // Event handlers
  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };
  
  // Mobile-specific tap handler
  const handleTap = () => {
    if (isMobile) {
      // On mobile, look for videos first, then fallback to images
      let mediaItem;
      
      // Try to find a video first
      const videoItem = performerMedia.find(item => item.type === 'video');
      
      if (videoItem) {
        mediaItem = videoItem;
      } else {
        // If no video, use the first item (likely an image)
        mediaItem = performerMedia[0];
      }
      
      // Get position for the modal animation - use the container for mobile
      const element = document.getElementById(`card-deck-${performer.id}`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setSourcePosition({
          x: rect.left + (rect.width / 2),
          y: rect.top + (rect.height / 2),
          width: rect.width,
          height: rect.height
        });
      }
      
      setSelectedMedia(mediaItem);
      setModalOpen(true);
    }
  };
  
  // Handle card hover (selection) within the hovered deck
  const handleCardHover = (index) => {
    setSelectedIndex(index);
  };
  
  // Handle card click to open modal
  const handleCardClick = (mediaItem, index) => {
    setSelectedIndex(index);
    setSelectedMedia(mediaItem);
    
    // Get position for the modal animation
    if (cardsRef.current) {
      const cards = cardsRef.current.children;
      if (cards[index]) {
        const rect = cards[index].getBoundingClientRect();
        setSourcePosition({
          x: rect.left + (rect.width / 2),
          y: rect.top + (rect.height / 2),
          width: rect.width,
          height: rect.height
        });
      }
    }
    
    setModalOpen(true);
  };
  
  // Close modal
  const handleModalClose = () => {
    setModalOpen(false);
  };
  
  // Don't render anything if not visible yet
  if (!isVisible) {
    return (
      <div 
        id={`card-deck-${performer.id}`}
        style={{ 
          position: 'absolute',
          left: `${position.x}%`, 
          top: `${position.y}%`,
          width: '10px',
          height: '10px',
        }}
      />
    );
  }
  
  // Styles for components
  const containerStyle = {
    position: 'absolute',
    left: `${position.x}%`,
    top: `${position.y}%`,
    transform: 'translate(-50%, -50%)',
    width: isMobile ? '120px' : '140px',
    height: isMobile ? '120px' : '140px',
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
  };
  
  const cardsContainerStyle = {
    position: 'relative',
    width: '80px',
    height: '120px',
    display: isMobile ? 'none' : 'block' // Hide cards on mobile
  };
  
  const infoStyle = {
    position: 'absolute',
    top: isMobile ? '-60px' : '-40px',
    left: isMobile ? '10px' : '40px',
    transform: isMobile ?  'translate(-25%, 50% )' : 'translateX(-25%)', 
    backgroundColor: isMobile ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0)',
    color: 'white',
    padding: isMobile ? '8px 12px' : '4px 8px',
    borderRadius: '4px',
    fontSize: isMobile ? '14px' : '12px', 
    whiteSpace: 'nowrap',
    zIndex: 200,
    textAlign: 'center',
    pointerEvents: isMobile ? 'auto' : 'none', // Make clickable on mobile
    cursor: isMobile ? 'pointer' : 'default',
    opacity: modalOpen ? 0 : 1,
    transition: 'opacity 0.3s ease-out',
    border: isMobile ? 'none' : 'none', // Add colored border on mobile
    boxShadow: isMobile ? 'none' : 'none' // Add shadow on mobile
  };

  // We're removing the mobile-specific button style as we won't be using it

  return (
    <div 
      id={`card-deck-${performer.id}`}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTap}
    >
      {/* Info label - always visible and clickable on mobile */}
      <div 
        style={infoStyle} 
        onClick={isMobile ? handleTap : undefined} // Only attach click handler on mobile
      >
        <div style={{ fontWeight: 'bold' }}>{name}</div>
        <div style={{ fontSize: isMobile ? '12px' : '10px' }}>{instrument}</div>
        {isMobile && (
          <div style={{ fontSize: '10px', marginTop: '2px', fontStyle: 'italic' }}>
            Tap to view media
          </div>
        )}
      </div>
      
      {/* Cards container - hidden on mobile */}
      <div 
        ref={cardsRef} 
        style={cardsContainerStyle}
      >
        {performerMedia.map((mediaItem, index) => (
          <Card
            key={`${performer.id}-card-${index}`}
            index={index}
            mediaItem={mediaItem}
            totalCards={performerMedia.length}
            isHovered={isHovered}
            selectedIndex={selectedIndex}
            color={color}
            onClick={handleCardClick}
            onMouseEnter={handleCardHover}
          />
        ))}
      </div>
      
      {/* Modal rendered via Portal to break out of constraints */}
      {modalOpen && selectedMedia && ReactDOM.createPortal(
        <InPlaceMediaModal 
          media={selectedMedia} 
          onClose={handleModalClose} 
          performerName={name}
          performerPiece={piece}
          performerInstrument={instrument}
          sourcePosition={sourcePosition}
          performer={performer}
        />,
        document.getElementById('modal-root')
      )}
    </div>
  );
};

export default React.memo(CardDeckHotspot);