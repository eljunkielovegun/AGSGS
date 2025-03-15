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
        
        {/* Mobile performer list using our React component */}
        {isMobile && (
          <div style={{ 
            width: '100%', 
            display: 'flex', 
            justifyContent: 'center',
            marginTop: '15px'
          }}>
            <Suspense fallback={<div style={{color: 'white', textAlign: 'center'}}>Loading...</div>}>
              <MobilePerformerList performers={performerData} />
            </Suspense>
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