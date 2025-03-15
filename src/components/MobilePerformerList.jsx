import React, { useEffect } from 'react';

const MobilePerformerList = ({ performers }) => {
  
  // Sort performers by ID
  const sortedPerformers = performers ? [...performers].sort((a, b) => 
    parseInt(a.id) - parseInt(b.id)
  ) : [];
  
  // Remove any existing modal-root to prevent it from blocking clicks
  useEffect(() => {
    // First, remove any existing modal-root as it might be blocking clicks
    const existingModalRoot = document.getElementById('modal-root');
    if (existingModalRoot) {
      existingModalRoot.remove();
    }
  }, []);
  
  const handlePerformerClick = (performer) => {
    // Clear any existing viewer first
    const existingViewer = document.getElementById('mobile-media-viewer');
    if (existingViewer) {
      existingViewer.remove();
    }
    
    // Get first media item or fallback
    const mediaItem = performer.media && performer.media.length > 0 
      ? performer.media[0] 
      : { type: 'image', src: '/images/performers/misc/Audience.jpg' };
    
    // Create a fresh viewer container
    const viewer = document.createElement('div');
    viewer.id = 'mobile-media-viewer';
    viewer.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: black;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000; /* Higher than any other element */
    `;
    
    // Close on click of the background
    viewer.addEventListener('click', (e) => {
      if (e.target === viewer) { // Only if clicking the background
        viewer.remove();
      }
    });
    
    // Create the media element
    if (mediaItem.type === 'image') {
      const img = document.createElement('img');
      img.src = mediaItem.src;
      img.style.cssText = 'max-width: 95%; max-height: 90%; object-fit: contain;';
      
      // Stop bubbling from media click to prevent closing
      img.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      
      viewer.appendChild(img);
    } else {
      const video = document.createElement('video');
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.style.cssText = 'max-width: 95%; max-height: 90%; object-fit: contain;';
      
      const source = document.createElement('source');
      source.src = mediaItem.src;
      source.type = 'video/mp4';
      video.appendChild(source);
      
      // Stop bubbling from media click to prevent closing
      video.addEventListener('click', (e) => {
        e.stopPropagation();
      });
      
      viewer.appendChild(video);
    }
    
    // Add swipe navigation if multiple media items
    if (performer.media && performer.media.length > 1) {
      let currentIndex = 0;
      let touchStartX = null;
      
      // Swipe detection
      viewer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
      });
      
      viewer.addEventListener('touchend', (e) => {
        if (!touchStartX) return;
        
        const touchEndX = e.changedTouches[0].clientX;
        const distance = touchStartX - touchEndX;
        
        // If significant swipe
        if (Math.abs(distance) > 50) {
          if (distance > 0 && currentIndex < performer.media.length - 1) {
            // Left swipe - next
            currentIndex++;
            updateMedia();
          } else if (distance < 0 && currentIndex > 0) {
            // Right swipe - previous
            currentIndex--;
            updateMedia();
          }
        }
        
        touchStartX = null;
      });
      
      // Update media content
      function updateMedia() {
        const newMedia = performer.media[currentIndex];
        
        // Clear existing content
        viewer.innerHTML = '';
        
        // Create new media element
        if (newMedia.type === 'image') {
          const img = document.createElement('img');
          img.src = newMedia.src;
          img.style.cssText = 'max-width: 95%; max-height: 90%; object-fit: contain;';
          img.addEventListener('click', e => e.stopPropagation());
          viewer.appendChild(img);
        } else {
          const video = document.createElement('video');
          video.controls = true;
          video.autoplay = true;
          video.playsInline = true;
          video.style.cssText = 'max-width: 95%; max-height: 90%; object-fit: contain;';
          
          const source = document.createElement('source');
          source.src = newMedia.src;
          source.type = 'video/mp4';
          video.appendChild(source);
          
          video.addEventListener('click', e => e.stopPropagation());
          viewer.appendChild(video);
        }
      }
    }
    
    // Add to the body
    document.body.appendChild(viewer);
  };
  
  // No longer need modal close handler with direct DOM approach
  
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
                  <span style={{ color: 'white' }}>
                    {performer.name} <span style={{ marginLeft: '4px', fontSize: '14px', color: 'white', fontWeight: 'bold' }}>→</span>
                  </span>
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
      {/* We're now using direct DOM manipulation instead of React portal */}
    </div>
  );
};

export default MobilePerformerList;