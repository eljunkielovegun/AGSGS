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
  
  const handlePerformerClick = (performer) => {
    console.log("Performer clicked:", performer.name);
    setSelectedPerformer(performer);
    
    // Get the first media item or use fallback
    const mediaItem = performer.media && performer.media.length > 0 
      ? performer.media[0] 
      : { type: 'image', src: '/images/performers/misc/Audience.jpg', alt: 'Performer' };
      
    setSelectedMedia(mediaItem);
    setModalOpen(true);
  };
  
  const handleModalClose = () => {
    setModalOpen(false);
  };
  
  return (
    <div className="fixed left-0 top-36 w-full z-50 px-6 text-white" style={{backgroundColor: 'rgba(0,0,0,0.1)'}}>
      <div className="max-h-[60vh] overflow-y-auto">
        <p className="mb-4 text-sm">Tap a performer to view their media:</p>
        <ul className="space-y-4">
          {sortedPerformers.map(performer => (
            <li 
              key={performer.id}
              className="pb-3"
              onClick={() => handlePerformerClick(performer)}
            >
              <div className="font-bold text-sm" style={{ color: performer.color || '#ffffff' }}>
                {performer.name}
              </div>
              <div className="text-xs text-gray-300">
                {performer.instrument}
              </div>
            </li>
          ))}
        </ul>
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