import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import InPlaceMediaMobile from './InPlaceMediaMobile';

const MobilePerformerList = ({ performers }) => {
  const [selectedPerformer, setSelectedPerformer] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Debug log
  useEffect(() => {
    console.log("MobilePerformerList mounted with performers:", performers ? performers.length : 0);
  }, [performers]);
  
  // Sort performers by ID
  const sortedPerformers = performers ? [...performers].sort((a, b) => 
    parseInt(a.id) - parseInt(b.id)
  ) : [];
  
  // Create portal container for modals if it doesn't exist
  useEffect(() => {
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
  
  const handlePerformerClick = (performer) => {
    console.log("Performer clicked:", performer.name);
    setSelectedPerformer(performer);
    
    // Check if performer has media
    if (performer.media && performer.media.length > 0) {
      // Try to find a video first
      const videoMedia = performer.media.find(item => item.type === 'video');
      
      // If video exists, use that, otherwise use the first media item
      const mediaItem = videoMedia || performer.media[0];
      setSelectedMedia(mediaItem);
    } else {
      // Use fallback if no media is available
      setSelectedMedia({ type: 'image', src: '/images/performers/misc/Audience.jpg', alt: 'Performer' });
    }
    
    setModalOpen(true);
  };
  
  const handleModalClose = () => {
    setModalOpen(false);
  };
  
  return (
    <div 
      className="fixed inset-0 flex flex-col items-center z-[9000]" 
      style={{ 
        pointerEvents: 'auto', 
        paddingTop: '180px',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.5) 25%, rgba(0,0,0,0.7) 100%)'
      }}
    >
      <div className="w-[95%] max-w-md bg-black bg-opacity-90 rounded-lg shadow-xl border border-gray-800 p-4 backdrop-blur-md">
        <h2 className="text-white text-lg font-bold mb-2 text-center">Performers</h2>
        <p className="text-white text-xs mb-4 text-center">Tap a performer to view their media</p>
        
        <div className="max-h-[60vh] overflow-y-auto px-2 py-2">
          <ul className="space-y-3 divide-y divide-gray-700">
            {sortedPerformers.map(performer => (
              <li 
                key={performer.id}
                className="pt-3 pb-3 active:bg-gray-800 active:bg-opacity-50 rounded-md transition-colors"
                onClick={() => handlePerformerClick(performer)}
              >
                <div className="flex items-start">
                  {/* Color indicator dot */}
                  <div 
                    className="w-3 h-3 rounded-full mt-1 mr-2 flex-shrink-0" 
                    style={{ backgroundColor: performer.color || '#ffffff' }}
                  ></div>
                  
                  <div className="flex-1">
                    <div className="font-bold text-white">
                      {performer.name}
                    </div>
                    <div className="text-xs text-gray-300 mt-1 italic">
                      "{performer.piece}"
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {performer.instrument}
                    </div>
                  </div>
                  
                  {/* Media indicator */}
                  <div className="text-xs text-gray-400 ml-2 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      {/* Console log for debugging - remove in production */}
      <div style={{ display: 'none' }}>
        {console.log("MobilePerformerList rendered with", sortedPerformers.length, "performers")}
      </div>
      
      {/* Modal rendered via Portal */}
      {modalOpen && selectedMedia && selectedPerformer && ReactDOM.createPortal(
        <InPlaceMediaMobile 
          media={selectedMedia} 
          onClose={handleModalClose} 
          performerName={selectedPerformer.name}
          performerPiece={selectedPerformer.piece}
          performerInstrument={selectedPerformer.instrument}
          sourcePosition={null}
          performer={selectedPerformer}
        />,
        document.getElementById('modal-root')
      )}
    </div>
  );
};

export default MobilePerformerList;