# Concert Stage Documentation

An interactive single-page React application to document a concert, where hovering over specific parts of the stage reveals media carousels for each performer.

## Features

- Interactive stage background with hotspots for each performer
- Hover to reveal image/video carousels for each performer
- Click to enlarge images or play videos in a modal
- Responsive design that works on all screen sizes

## Setup and Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Directory Structure

- `public/images/` - Place your stage background and performer media here
  - `stage-background.jpg` - The main stage image
  - `performers/` - One folder for each performer's media

## Customizing Performers

Edit the `src/components/PerformerData.js` file to:
- Add/remove performers
- Change their position on the stage
- Update their media files
- Adjust hotspot size and color
- Change carousel positioning

## Deployment to Vercel

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Deploy with the following settings:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

Or use the Vercel CLI:
```bash
npm install -g vercel
vercel
```

## Technologies Used

- React
- Vite
- Tailwind CSS
- React Responsive Carousel
- Framer Motion
# AdventurousGuitarDocmentation
