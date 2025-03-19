// This file contains the data for each performer including their position on stage,
// name, and media files (images/videos)

const performerData = [
  {
    id: 1,
    name: "Xingyi Betty Chen with Haoyang Aisling Ma",
    piece: "through the fractured wake of that long forgotten pipedream",
    instrument: "Betty Chen: Composer/Performer, Aisling MA: Movement",
    position:  {
      "x": 9.77,
      "y": 54.72
    }, // Center stage - adjust as needed
    size: 60,
    color: "#9c27b0", // Purple
    media: [
  
      // Then images
      { type: "image", src: "/images/performers/chen/Betty_Rig.jpg", alt: "Betty Chen's equipment" },
      { type: "image", src: "/images/performers/chen/Betty_Live-2.jpg", alt: "Betty Chen performance" },
          // Video first
          { type: "video", src: "/images/performers/chen/Betty_Live.mp4", alt: "Betty Chen live performance video", poster: "/images/performers/chen/Betty_Live1.jpg" },
      { type: "image", src: "/images/performers/chen/Betty_Live1.jpg", alt: "Betty Chen performing" },
    ],
    carouselPosition: "bottom",
  },

  {
    id: 2,
    name: "Ryan Edwards",
    piece: "Untitled Improvisation",
    instrument: "electric guitar",
    position:  {
      "x": 35.64,
      "y": 50.56
    }, // Far left - adjust as needed
    size: 55,
    color: "#2196f3", // Blue
    media: [
      
      // Then images
      
      { type: "image", src: "/images/performers/edwards/Ryan_Live-2.jpg", alt: "Ryan Edwards performance" },
      { type: "image", src: "/images/performers/edwards/Ryan_Live-3.jpg", alt: "Ryan Edwards performing" },
      { type: "image", src: "/images/performers/edwards/Ryan_Amp.JPG", alt: "Ryan Edwards' amplifier" },
      // Video first
      { type: "video", src: "/images/performers/edwards/Ryan_Live.mp4", alt: "Ryan Edwards live performance video", poster: "/images/performers/edwards/Ryan_Live.jpg" },

      { type: "image", src: "/images/performers/edwards/Ryan_PreparedGuitar.jpg", alt: "Ryan's prepared guitar" },
      { type: "image", src: "/images/performers/edwards/Ryan_Impliments.jpg", alt: "Ryan's implements" },
      { type: "image", src: "/images/performers/edwards/Ryan_Live.jpg", alt: "Ryan Edwards performing" },
    ],
    carouselPosition: "right",
  },
  {
    id: 3,
    name: "Chapman Welch",
    piece: "Secret Society",
    instrument: "electric guitar and live electronics",
    position:  {
      "x": 76,
      "y": 50.56
    },
   // Right of center - adjust as needed
    size: 55,
    color: "#ff9800", // Orange
    media: [
     
      // { type: "video", src: "/images/performers/welch/Chapman_live-2.mov", alt: "Chapman Welch performance" },
      // Then images
     
      { type: "image", src: "/images/performers/welch/Chapman_Pedals.jpg", alt: "Chapman's pedal setup" },
      { type: "image", src: "/images/performers/welch/Chapman_Max.jpg", alt: "Chapman's Max/MSP patch" },
       // Videos first
       { type: "video", src: "/images/performers/welch/Chapman_Live-1.mp4", alt: "Chapman Welch performance video", poster: "/images/performers/welch/Chapman_Live-1.jpg" },
      { type: "image", src: "/images/performers/welch/Champman_Max+Controllers.jpg", alt: "Chapman's controllers" },
      { type: "image", src: "/images/performers/welch/Chapman_Live-1.jpg", alt: "Chapman Welch performing" },
    ],
    carouselPosition: "left",
  },
  {
    id: 4,
    name: "Kevin Patton",
    piece: "The Way is Blocked",
    instrument: "acoustic guitar and live electronics",
    position: {
      "x": 61.22,
      "y": 55.92
    }, // Far right - adjust as needed
    size: 55,
    color: "#4caf50", // Green
    media: [
      
      // Then images
      { type: "image", src: "/images/performers/patton/KP_Live-1.jpg", alt: "Kevin Patton performing" },

      { type: "image", src: "/images/performers/patton/KP_Live-3.jpg", alt: "Kevin Patton live" },
      { type: "image", src: "/images/performers/patton/KP_Live-4.jpg", alt: "Kevin Patton performing" },
      { type: "image", src: "/images/performers/patton/KP_Live-5.jpg", alt: "Kevin Patton performance" },

      { type: "video", src: "/images/performers/patton/KP_Live.mov", alt: "Kevin Patton live performance video", poster: "/images/performers/patton/KP_Live-1.jpg" },

      { type: "image", src: "/images/performers/patton/KP_Max.jpg", alt: "Kevin's Max/MSP patch" },
      { type: "image", src: "/images/performers/patton/KP_Pedals.JPG", alt: "Kevin's pedal setup" },
      { type: "image", src: "/images/performers/patton/KP_Live-2.jpg", alt: "Kevin Patton performance" },
    ],
    carouselPosition: "left",
  },
  {
    id: 5,
    name: "Kelly Doyle",
    piece: "Untitled Improvisation",
    instrument: "electric guitar",
    position:   {
      "x": 20.66,
      "y": 59.53
    },
    // position:  {
    //   "x": 62.11,
    //   "y": 50.56
    // }, // Lower left - adjust as needed
    size: 55,
    color: "#f44336", // Red
    media: [
      
      // Then images
      
      { type: "image", src: "/images/performers/doyle/Kelly_Live-2.jpg", alt: "Kelly Doyle performance" },
      { type: "image", src: "/images/performers/doyle/Kelly_Amp.JPG", alt: "Kelly's amplifier" },
      { type: "image", src: "/images/performers/doyle/Kelly_Pedals.jpg", alt: "Kelly's pedal setup" },
      // Video first
      { type: "video", src: "/images/performers/doyle/Kelly_Live-3.mp4", alt: "Kelly Doyle live performance video", poster: "/images/performers/doyle/Kelly_Live.jpg" },
      { type: "image", src: "/images/performers/doyle/Kelly_Pedals-2.jpg", alt: "Kelly's pedals close-up" },
      { type: "image", src: "/images/performers/doyle/Kelly_Live.jpg", alt: "Kelly Doyle performing" },
    ],
    carouselPosition: "top",
  },
  {
    id: 6,
    name: "Christopher Trapani",
    piece: "Untitled Improvisation",
    instrument: "lap steel",
    position: {
      "x": 47.22,
      "y": 60.92
    },
 
    size: 55,
    color: "#00bcd4", // Cyan
    media: [
     
      // Then images
     
      { type: "image", src: "/images/performers/trapani/Trapani_Live-2.jpg", alt: "Christopher Trapani performance" },
      { type: "image", src: "/images/performers/trapani/Trapani_Amp.JPG", alt: "Trapani's amplifier" },
       // Videos first
       { type: "video", src: "/images/performers/trapani/Trapani_Live.mp4", alt: "Christopher Trapani live performance", poster: "/images/performers/trapani/Trapani_Live-1.jpg" },
       { type: "video", src: "/images/performers/misc/Jeff-Trapani_Live.mp4", alt: "Jeff & Trapani performance", poster: "/images/performers/trapani/Trapani_Live-2.jpg" },

      { type: "image", src: "/images/performers/trapani/Trapani_Pedals.jpg", alt: "Trapani's pedal setup" },
      { type: "image", src: "/images/performers/trapani/Trapani_Max.jpg", alt: "Trapani's Max/MSP patch" },
      { type: "image", src: "/images/performers/trapani/Trapani_Live-1.jpg", alt: "Christopher Trapani performing" },
    ],
    carouselPosition: "top",
  },
  {
    id: 7,
    name: "Jeff Snyder",
    piece: "Untitled Improvisation",
    instrument: "Electrosteel",
    position: {
      "x": 91,
      "y": 61.8
    }, // Lower right - adjust as needed
    size: 55,
    color: "#673ab7", // Deep Purple
    media: [
   
      // Then images
     
      { type: "image", src: "/images/performers/snyder/Jeff-trapani_Live-1.jpg", alt: "Jeff with Trapani" },
      { type: "image", src: "/images/performers/snyder/JeffSillyFace.JPG", alt: "Jeff making a silly face" },
      { type: "image", src: "/images/performers/snyder/Jeff_Pedals.JPG", alt: "Jeff's pedal setup" },
         // Videos first
         { type: "video", src: "/images/performers/snyder/Jeff_Live-2.mp4", alt: "Jeff Snyder performance video", poster: "/images/performers/snyder/Jeff_Live-1.jpg" },
         { type: "video", src: "/images/performers/misc/Jeff-Trapani_Live.mp4", alt: "Jeff & Trapani performance", poster: "/images/performers/snyder/Jeff-trapani_Live-1.jpg" },
      { type: "image", src: "/images/performers/snyder/Jeff_mixer.JPG", alt: "Jeff's mixer setup" },
      { type: "image", src: "/images/performers/snyder/Jeff_Live-1.jpg", alt: "Jeff Snyder performing" },
    ],
    carouselPosition: "top",
  },
];

export default performerData;