import React, { useEffect } from 'react';

const MobilePerformerList = ({ performers }) => {
  
  // Sort performers by ID
  const sortedPerformers = performers ? [...performers].sort((a, b) => 
    parseInt(a.id) - parseInt(b.id)
  ) : [];
  
  // Create portal container for modals
  useEffect(() => {
    // Add animation styles to document
    if (!document.getElementById('mobile-viewer-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'mobile-viewer-styles';
      styleSheet.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `;
      document.head.appendChild(styleSheet);
    }
    
    if (!document.getElementById('modal-root')) {
      const modalRoot = document.createElement('div');
      modalRoot.id = 'modal-root';
      modalRoot.style.position = 'fixed';
      modalRoot.style.top = '0';
      modalRoot.style.left = '0';
      modalRoot.style.width = '100%';
      modalRoot.style.height = '100%';
      modalRoot.style.zIndex = '9999';
      modalRoot.style.pointerEvents = 'auto';
      document.body.appendChild(modalRoot);
    }
    
    return () => {
      const modalRoot = document.getElementById('modal-root');
      if (modalRoot && !modalRoot.hasChildNodes()) {
        document.body.removeChild(modalRoot);
      }
    };
  }, []);
  
  const handlePerformerClick = (performer) => {
    console.log("Performer clicked:", performer.name);
    
    // Use a direct approach that doesn't rely on React state
    const modalRoot = document.getElementById('modal-root');
    if (!modalRoot) return;
    
    // Clear any existing content
    modalRoot.innerHTML = '';
    
    // Get the first media item or fallback
    const mediaItem = performer.media && performer.media.length > 0 
      ? performer.media[0] 
      : { type: 'image', src: '/images/performers/misc/Audience.jpg' };
    
    console.log("Opening media:", mediaItem);
    
    // Create a full-screen black overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:black;display:flex;align-items:center;justify-content:center;z-index:9999;';
    
    // Handle click to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        modalRoot.innerHTML = '';
      }
    });
    
    // Create the media element
    if (mediaItem.type === 'image') {
      const img = document.createElement('img');
      img.src = mediaItem.src;
      img.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;';
      img.addEventListener('click', (e) => e.stopPropagation());
      overlay.appendChild(img);
    } else {
      const video = document.createElement('video');
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;';
      video.addEventListener('click', (e) => e.stopPropagation());
      
      const source = document.createElement('source');
      source.src = mediaItem.src;
      source.type = 'video/mp4';
      video.appendChild(source);
      
      overlay.appendChild(video);
    }
    
    // Add swipe handling for navigation if multiple media items
    if (performer.media && performer.media.length > 1) {
      let touchStartX = null;
      let currentIndex = 0;
      
      overlay.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      });
      
      overlay.addEventListener('touchend', (e) => {
        if (!touchStartX) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const distance = touchStartX - touchEndX;
        
        // Minimum swipe distance
        if (Math.abs(distance) > 50) {
          if (distance > 0 && currentIndex < performer.media.length - 1) {
            // Left swipe - next media
            currentIndex++;
            updateMedia();
          } else if (distance < 0 && currentIndex > 0) {
            // Right swipe - previous media
            currentIndex--;
            updateMedia();
          }
        }
        
        touchStartX = null;
      });
      
      // Function to update displayed media
      function updateMedia() {
        const mediaItem = performer.media[currentIndex];
        overlay.innerHTML = '';
        
        if (mediaItem.type === 'image') {
          const img = document.createElement('img');
          img.src = mediaItem.src;
          img.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;';
          img.addEventListener('click', (e) => e.stopPropagation());
          overlay.appendChild(img);
        } else {
          const video = document.createElement('video');
          video.controls = true;
          video.autoplay = true;
          video.playsInline = true;
          video.style.cssText = 'max-width:100%;max-height:100%;object-fit:contain;';
          video.addEventListener('click', (e) => e.stopPropagation());
          
          const source = document.createElement('source');
          source.src = mediaItem.src;
          source.type = 'video/mp4';
          video.appendChild(source);
          
          overlay.appendChild(video);
        }
      }
    }
    
    // Add to modal root
    modalRoot.appendChild(overlay);
  };
  
  return (
    <div 
      style={{ 
        width: '100%',
        maxWidth: '500px',
        margin: '0 auto',
        padding: '0 10px',
        color: 'white'
      }}
    >
      <div style={{ 
        maxHeight: '65vh', 
        overflowY: 'auto',
        backgroundColor: 'transparent',
        padding: '5px'
      }}>
        <ul style={{ 
          listStyle: 'none', 
          padding: 0, 
          margin: 0 
        }}>
          {sortedPerformers.map(performer => (
            <li 
              key={performer.id}
              style={{ 
                padding: '5px 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start'
              }}
              onClick={() => handlePerformerClick(performer)}
            >
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: 'bold', 
                  marginBottom: '2px', 
                  fontSize: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  textShadow: '0 0 4px rgba(0,0,0,0.8)'
                }}>
                  {performer.name} <span style={{ marginLeft: '4px', fontSize: '14px', color: 'white', fontWeight: 'bold' }}>→</span>
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#eee', 
                  fontStyle: 'italic', 
                  marginBottom: '2px',
                  textShadow: '0 0 4px rgba(0,0,0,0.8)'
                }}>
                  "{performer.piece}"
                </div>
                <div style={{ 
                  fontSize: '11px', 
                  color: '#ffffff',
                  textShadow: '0 0 4px rgba(0,0,0,0.8)'
                }}>
                  {performer.instrument}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MobilePerformerList;