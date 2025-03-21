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
        {!isMobile && (
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
                  e.target.onerror = null;
                  e.target.src = "/images/REMLABS-Guitar.png";
                  e.target.onerror = () => e.target.style.display = 'none';
                }}
              />
            </div>
          </div>
        )}
        
        {/* Mobile header with just the logo */}
        {isMobile && (
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: '15px 0'
          }}>
            <img 
              src="/REMLABS-Guitar.png" 
              alt="REMLABS Guitar" 
              style={{ 
                width: '60%',
                objectFit: 'contain',
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.7))'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/images/REMLABS-Guitar.png";
                e.target.onerror = () => e.target.style.display = 'none';
              }}
            />
        
         
          </div>
 
        )
    
        }
          {isMobile && (
              <div style={{ 
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                paddingRight: '10px',
                marginBottom: '5px'
              }}>
                <p className="site-subtitle" style={{
                  margin: '0',
                  color: 'yellow',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  textShadow: '0 0 4px rgba(0,0,0,0.8)'
                }}>
                →  REMLABS, Sheperd School of Music, Houston, TX,  March 6, 2025 ← <span style={{marginLeft: '4px', fontWeight: 'bold'}}></span>
                </p>
              </div>
            )}

        {/* Mobile performer list using our React component */}
        {isMobile && (
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center',
            marginTop: '0'
          }}>

            <Suspense fallback={<div>Loading performer list...</div>}>
              <MobilePerformerList performers={performerData} />
            </Suspense>
          </div>
        )}
      </div>
      
      {/* Debug info removed */}
    </div>
  );
}

export default App;