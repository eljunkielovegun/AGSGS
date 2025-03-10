import React, { useState, useEffect, lazy, Suspense } from 'react';
import StageBackground from './components/StageBackground';
import HotspotOverlay from './components/HotspotOverlay';
import performerData from './components/PerformerData';

// Lazy-load the MobilePerformerList component
const MobileList = lazy(() => import('./components/MobilePerformerList'));

function App() {
  return (
    <div className="App w-screen h-screen overflow-hidden">
      <StageBackground>
        <HotspotOverlay />
      </StageBackground>
      
{/* Top-aligned title overlay */}
<div className="title-overlay" style={{ zIndex: 900  }}>
        <div className="flex items-center">
          <div style = {{marginLeft: '1.5em' }}>
            <h1 className="site-title" style = {{marginBottom: '0px' }}> Summit for Adventurous Electric Guitar In the Gulf South</h1>
            <p className="site-subtitle" style = {{marginTop: '0' }}>REMLABS, March 6, 2025
            </p>
            {/* <div className="ml-auto">
            <p className="instructions" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.9)', marginLeft: '1.5em' }}>Hover over performers to explore media</p>
          </div> */}
          </div>
          <div className="ml-4">
            <img 
              src="/REMLABS-Guitar.png" 
              alt="REMLABS Guitar" 
              style={{ 
                // float: 'right',
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
      </div>
      
      Ultra-simple fallback as a last resort
      {/* <div style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 99999,
        backgroundColor: 'black',
        color: 'white',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
      </div> */}


    </div>
  );
}

export default App;