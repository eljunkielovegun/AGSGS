import React, { useState, useEffect, lazy, Suspense } from 'react';
import StageBackground from './components/StageBackground';
import HotspotOverlay from './components/HotspotOverlay';
import performerData from './components/PerformerData';

// Lazy-load the MobilePerformerList component
const MobilePerformerList = lazy(() => import('./components/MobilePerformerList'));

function App() {
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if on mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Add event listener for custom media navigation events
  useEffect(() => {
    const handleShowMedia = (event) => {
      if (event.performerId && event.mediaIndex !== undefined) {
        // Find the performer element and simulate a click with the correct media index
        const performerEl = document.getElementById(`performer-${event.performerId}`);
        if (performerEl) {
          const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          
          // Add the media index to the event
          Object.defineProperty(clickEvent, 'target', {
            value: { mediaIndex: event.mediaIndex }
          });
          
          performerEl.dispatchEvent(clickEvent);
        }
      }
    };
    
    document.addEventListener('showMedia', handleShowMedia);
    
    return () => {
      document.removeEventListener('showMedia', handleShowMedia);
    };
  }, []);

  return (
    <div className="App w-screen h-screen overflow-hidden">
      {/* Background Layer */}
      <StageBackground>
        {!isMobile && <HotspotOverlay />}
      </StageBackground>
      
      {/* Top-aligned title overlay */}
      <div className="title-overlay" style={{ zIndex: 900 }}>
        <div className="flex items-center">
          <div style={{marginLeft: '1.5em'}}>
            <h1 className="site-title" style={{marginBottom: '0px'}}> Summit for Adventurous Electric Guitar In the Gulf South</h1>
            <p className="site-subtitle" style={{marginTop: '0'}}>REMLABS, March 6, 2025
            </p>
          </div>
          <div className="ml-4">
            <img 
              src="/REMLABS-Guitar.png" 
              alt="REMLABS Guitar" 
              style={{ 
                marginTop: '1em',
                height: '150px', 
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.7))'
              }}
              onError={(e) => {
                console.log("Primary image path failed, trying alternative");
                e.target.onerror = null;
                e.target.src = "/images/REMLABS-Guitar.png";
                
                // Final fallback
                e.target.onerror = () => {
                  console.log("All image paths failed");
                  e.target.style.display = 'none';
                };
              }}
            />
          </div>
        </div>
        
        {/* Mobile performer list inside the title overlay - this ensures it's positioned directly below the logo */}
        {isMobile && (
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center',
            marginTop: '1.5rem'
          }}>
            <div style={{
              width: '95%',
              maxWidth: '500px',
              backgroundColor: 'transparent',
              padding: '0',
              color: 'white'
            }}>
              <div style={{ maxHeight: '65vh', overflowY: 'auto', padding: '0' }}>
                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                  {performerData.sort((a, b) => parseInt(a.id) - parseInt(b.id)).map(performer => (
                    <li 
                      key={performer.id}
                      id={`performer-${performer.id}`}
                      style={{ 
                        padding: '8px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer'
                      }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling
                        console.log(`Performer clicked: ${performer.name}`);
                        
                        // First, remove any existing viewer
                        const existingViewer = document.querySelector('#media-viewer');
                        if (existingViewer) {
                          document.body.removeChild(existingViewer);
                        }
                        
                        // Check if we have a specific media index (from swipe navigation)
                        let mediaIndex = 0;
                        if (e.target && e.target.mediaIndex !== undefined) {
                          mediaIndex = e.target.mediaIndex;
                        }
                        // For initial load, prioritize images first, then videos
                        // (This reverses the previous logic which prioritized videos)
                        
                        // Get the media at the specified index or fallback
                        const media = performer.media && performer.media.length > mediaIndex 
                                      ? performer.media[mediaIndex] 
                                      : performer.media?.[0] || 
                                      { type: 'image', src: '/images/performers/misc/Audience.jpg' };
                                      
                        // Create the media viewer
                        const viewer = document.createElement('div');
                        viewer.id = 'media-viewer';
                        viewer.style.position = 'fixed';
                        viewer.style.top = '0';
                        viewer.style.left = '0';
                        viewer.style.width = '100%';
                        viewer.style.height = '100%';
                        viewer.style.backgroundColor = 'rgba(0,0,0,0.9)';
                        viewer.style.zIndex = '10000';
                        viewer.style.display = 'flex';
                        viewer.style.flexDirection = 'column';
                        viewer.style.alignItems = 'center';
                        viewer.style.justifyContent = 'center';
                        
                        // Create a completely separate content container that won't close on click
                        const contentContainer = document.createElement('div');
                        contentContainer.style.display = 'flex';
                        contentContainer.style.flexDirection = 'column';
                        contentContainer.style.alignItems = 'center';
                        contentContainer.style.justifyContent = 'center';
                        contentContainer.style.maxWidth = '100%';
                        contentContainer.style.maxHeight = '100%';
                        contentContainer.style.position = 'relative';
                        contentContainer.style.zIndex = '2';
                        
                        // Prevent click events from bubbling up
                        contentContainer.addEventListener('click', (e) => {
                          e.stopPropagation();
                        });
                        
                        // Add contentContainer to viewer
                        viewer.appendChild(contentContainer);
                        
                        // Add close button
                        const closeBtn = document.createElement('button');
                        closeBtn.textContent = 'Close';
                        closeBtn.style.position = 'absolute';
                        closeBtn.style.top = '20px';
                        closeBtn.style.right = '20px';
                        closeBtn.style.padding = '8px 16px';
                        closeBtn.style.backgroundColor = 'rgba(0,0,0,0.5)';
                        closeBtn.style.color = 'white';
                        closeBtn.style.border = 'none';
                        closeBtn.style.borderRadius = '4px';
                        closeBtn.style.cursor = 'pointer';
                        closeBtn.onclick = () => document.body.removeChild(viewer);
                        viewer.appendChild(closeBtn);
                        
                        // Add navigation buttons
                        if (performer.media && performer.media.length > 1) {
                          const navContainer = document.createElement('div');
                          navContainer.style.position = 'absolute';
                          navContainer.style.bottom = '20px';
                          navContainer.style.left = '0';
                          navContainer.style.right = '0';
                          navContainer.style.display = 'flex';
                          navContainer.style.justifyContent = 'center';
                          navContainer.style.gap = '20px';
                          
                          // Previous button
                          const prevBtn = document.createElement('button');
                          prevBtn.innerHTML = '&larr;';
                          prevBtn.style.padding = '8px 16px';
                          prevBtn.style.backgroundColor = 'rgba(0,0,0,0.5)';
                          prevBtn.style.color = 'white';
                          prevBtn.style.border = 'none';
                          prevBtn.style.borderRadius = '4px';
                          prevBtn.style.cursor = 'pointer';
                          prevBtn.disabled = mediaIndex === 0;
                          prevBtn.style.opacity = mediaIndex === 0 ? '0.5' : '1';
                          prevBtn.onclick = () => {
                            if (mediaIndex > 0) {
                              document.body.removeChild(viewer);
                              const evt = new CustomEvent('showMedia');
                              evt.performerId = performer.id;
                              evt.mediaIndex = mediaIndex - 1;
                              document.dispatchEvent(evt);
                            }
                          };
                          navContainer.appendChild(prevBtn);
                          
                          // Counter
                          const counter = document.createElement('div');
                          counter.textContent = `${mediaIndex + 1} / ${performer.media.length}`;
                          counter.style.color = 'white';
                          counter.style.padding = '8px 0';
                          navContainer.appendChild(counter);
                          
                          // Next button
                          const nextBtn = document.createElement('button');
                          nextBtn.innerHTML = '&rarr;';
                          nextBtn.style.padding = '8px 16px';
                          nextBtn.style.backgroundColor = 'rgba(0,0,0,0.5)';
                          nextBtn.style.color = 'white';
                          nextBtn.style.border = 'none';
                          nextBtn.style.borderRadius = '4px';
                          nextBtn.style.cursor = 'pointer';
                          nextBtn.disabled = mediaIndex === performer.media.length - 1;
                          nextBtn.style.opacity = mediaIndex === performer.media.length - 1 ? '0.5' : '1';
                          nextBtn.onclick = () => {
                            if (mediaIndex < performer.media.length - 1) {
                              document.body.removeChild(viewer);
                              const evt = new CustomEvent('showMedia');
                              evt.performerId = performer.id;
                              evt.mediaIndex = mediaIndex + 1;
                              document.dispatchEvent(evt);
                            }
                          };
                          navContainer.appendChild(nextBtn);
                          
                          viewer.appendChild(navContainer);
                        }
                        
                        // Add performer info
                        const info = document.createElement('div');
                        info.style.color = 'white';
                        info.style.textAlign = 'center';
                        info.style.marginBottom = '20px';
                        info.style.pointerEvents = 'none'; // Prevent clicks on text
                        info.innerHTML = `
                          <h3 style="margin-bottom: 8px; font-size: 18px;">${performer.name}</h3>
                          <p style="margin-bottom: 4px; font-style: italic;">"${performer.piece}"</p>
                          <p style="font-size: 14px; color: #ccc;">${performer.instrument}</p>
                          ${performer.media && performer.media.length > 1 ? 
                            `<p style="font-size: 12px; color: #999; margin-top: 12px;">${mediaIndex + 1} of ${performer.media.length}</p>
                             <p style="font-size: 11px; color: #888; margin-top: 4px;">Swipe horizontally to navigate • Swipe up/down to close</p>` : 
                            '<p style="font-size: 11px; color: #888; margin-top: 12px;">Swipe up/down to close</p>'}
                        `;
                        contentContainer.appendChild(info);
                        
                        // Add media element
                        if (media.type === 'image') {
                          const mediaWrapper = document.createElement('div');
                          mediaWrapper.style.maxWidth = '90%';
                          mediaWrapper.style.maxHeight = '60vh';
                          mediaWrapper.style.position = 'relative';
                          
                          // Prevent click events from propagating
                          mediaWrapper.addEventListener('click', (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          });
                          
                          const img = document.createElement('img');
                          img.src = media.src;
                          img.alt = performer.name;
                          img.style.maxWidth = '100%';
                          img.style.maxHeight = '60vh';
                          img.style.objectFit = 'contain';
                          
                          // Add desktop-only click behavior for image navigation
                          if (window.innerWidth >= 768) {
                            img.addEventListener('click', (e) => {
                              e.stopPropagation();
                              // For desktop, go to next image on click
                              if (performer.media && performer.media.length > 1 && mediaIndex < performer.media.length - 1) {
                                document.body.removeChild(viewer);
                                const evt = new CustomEvent('showMedia');
                                evt.performerId = performer.id;
                                evt.mediaIndex = mediaIndex + 1;
                                document.dispatchEvent(evt);
                              }
                            });
                          }
                          
                          mediaWrapper.appendChild(img);
                          contentContainer.appendChild(mediaWrapper);
                        } else {
                          const videoWrapper = document.createElement('div');
                          videoWrapper.style.maxWidth = '90%';
                          videoWrapper.style.maxHeight = '60vh';
                          videoWrapper.style.position = 'relative';
                          
                          // Prevent ANY click events from propagating out
                          videoWrapper.addEventListener('click', (e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          });
                          
                          const video = document.createElement('video');
                          video.controls = true;
                          video.playsInline = true;
                          video.style.width = '100%';
                          video.style.height = '100%';
                          video.style.maxHeight = '60vh';
                          video.style.backgroundColor = '#000';
                          
                          // Also stop clicks on the video itself
                          video.addEventListener('click', (e) => {
                            e.stopPropagation();
                          });
                          
                          // Add sources for different formats
                          const source1 = document.createElement('source');
                          source1.src = media.src;
                          source1.type = 'video/mp4';
                          video.appendChild(source1);
                          
                          const source2 = document.createElement('source');
                          source2.src = media.src.replace('.mp4', '.mov');
                          source2.type = 'video/quicktime';
                          video.appendChild(source2);
                          
                          videoWrapper.appendChild(video);
                          contentContainer.appendChild(videoWrapper);
                          
                          // Attempt to play
                          setTimeout(() => {
                            video.play().catch(err => console.error("Error playing video:", err));
                          }, 100);
                        }
                        
                        // Create separate touch overlay for swipe handling
                        const touchOverlay = document.createElement('div');
                        touchOverlay.style.position = 'absolute';
                        touchOverlay.style.top = '0';
                        touchOverlay.style.left = '0';
                        touchOverlay.style.width = '100%';
                        touchOverlay.style.height = '100%';
                        touchOverlay.style.zIndex = '5';
                        touchOverlay.style.cursor = 'default';
                        
                        // Block all click events from propagating through the overlay
                        touchOverlay.addEventListener('click', (e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }, true);
                        
                        // Add basic touch event handling for media navigation 
                        if (performer.media && performer.media.length > 1) {
                          // Track touch position
                          let touchStartX = 0;
                          let touchStartY = 0;
                          let touchHandled = false;
                          
                          // Add touch event listeners to the overlay
                          touchOverlay.addEventListener('touchstart', function(e) {
                            touchStartX = e.touches[0].clientX;
                            touchStartY = e.touches[0].clientY;
                            touchHandled = false;
                          }, false);
                          
                          touchOverlay.addEventListener('touchend', function(e) {
                            if (touchHandled) return;
                            
                            const touchEndX = e.changedTouches[0].clientX;
                            const touchEndY = e.changedTouches[0].clientY;
                            
                            // Calculate swipe distance
                            const diffX = touchEndX - touchStartX;
                            const diffY = touchEndY - touchStartY;
                            
                            // Determine if horizontal swipe is more significant
                            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                              touchHandled = true;
                              
                              // Handle horizontal swipe
                              if (diffX > 0 && mediaIndex > 0) {
                                // Right swipe = previous image
                                const prevIndex = mediaIndex - 1;
                                
                                // Remove viewer before dispatching event
                                if (document.body.contains(viewer)) {
                                  document.body.removeChild(viewer);
                                  
                                  setTimeout(() => {
                                    // Show previous media
                                    const evt = new CustomEvent('showMedia');
                                    evt.performerId = performer.id;
                                    evt.mediaIndex = prevIndex;
                                    document.dispatchEvent(evt);
                                  }, 50);
                                }
                              } else if (diffX < 0 && mediaIndex < performer.media.length - 1) {
                                // Left swipe = next image
                                const nextIndex = mediaIndex + 1;
                                
                                // Remove viewer before dispatching event
                                if (document.body.contains(viewer)) {
                                  document.body.removeChild(viewer);
                                  
                                  setTimeout(() => {
                                    // Show next media
                                    const evt = new CustomEvent('showMedia');
                                    evt.performerId = performer.id;
                                    evt.mediaIndex = nextIndex;
                                    document.dispatchEvent(evt);
                                  }, 50);
                                }
                              }
                            } else if (Math.abs(diffY) > 100) {
                              // Handle vertical swipe (only for closing)
                              touchHandled = true;
                              
                              if (document.body.contains(viewer)) {
                                document.body.removeChild(viewer);
                              }
                            }
                          }, false);
                        }
                        
                        // Add the touch overlay to the content container
                        contentContainer.appendChild(touchOverlay);
                        
                        // Create a standalone close button that won't be affected by other elements
                        const closeButton = document.createElement('button');
                        closeButton.textContent = '×';
                        closeButton.style.position = 'fixed'; // Use fixed positioning
                        closeButton.style.top = '10px';
                        closeButton.style.right = '10px';
                        closeButton.style.zIndex = '10001'; // Higher than other elements
                        closeButton.style.width = '40px';
                        closeButton.style.height = '40px';
                        closeButton.style.lineHeight = '36px';
                        closeButton.style.fontSize = '30px';
                        closeButton.style.backgroundColor = 'rgba(0,0,0,0.7)';
                        closeButton.style.color = 'white';
                        closeButton.style.border = '1px solid rgba(255,255,255,0.3)';
                        closeButton.style.borderRadius = '50%';
                        closeButton.style.cursor = 'pointer';
                        closeButton.style.display = 'flex';
                        closeButton.style.alignItems = 'center';
                        closeButton.style.justifyContent = 'center';
                        closeButton.style.fontFamily = 'sans-serif';
                        closeButton.style.fontWeight = 'bold';
                        
                        // Explicit click handler function
                        function closeViewerHandler(e) {
                          // Stop propagation
                          e.stopPropagation();
                          e.preventDefault();
                          
                          // Remove the event listener first to prevent multiple calls
                          closeButton.removeEventListener('click', closeViewerHandler);
                          
                          // Close the viewer
                          if (document.body.contains(viewer)) {
                            document.body.removeChild(viewer);
                          }
                          
                          return false; // Additional precaution to prevent default
                        }
                        
                        // Add event listener with the named function for reliable removal
                        closeButton.addEventListener('click', closeViewerHandler);
                        
                        // Append directly to viewer (not contentContainer)
                        viewer.appendChild(closeButton);
                        
                        document.body.appendChild(viewer);
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontWeight: 'bold', 
                          marginBottom: '2px', 
                          fontSize: '15px',
                          textShadow: '0 0 4px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,1)'
                        }}>
                          {performer.name} →
                        </div>
                        <div style={{ 
                          fontSize: '12px', 
                          color: '#eee', 
                          fontStyle: 'italic', 
                          marginBottom: '2px',
                          textShadow: '0 0 4px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,1)'
                        }}>
                          {performer.piece}
                        </div>
                        <div style={{ 
                          fontSize: '11px', 
                          color: '#ccc',
                          textShadow: '0 0 4px rgba(0,0,0,1), 0 0 6px rgba(0,0,0,1)'
                        }}>
                          {performer.instrument}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Debug info - hidden */}
      <div style={{ display: 'none' }}>
        {console.log("App rendered, isMobile:", isMobile)}
      </div>
    </div>
  );
}

export default App;