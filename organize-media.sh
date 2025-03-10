#!/bin/bash

# Set up color codes for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Organizing Concert Media Files ===${NC}"

# Check if source directory is provided
if [ -z "$1" ]; then
  echo -e "${RED}Error: Please provide the source directory containing your media files${NC}"
  echo -e "Usage: ./organize-media.sh /path/to/your/media/files"
  exit 1
fi

# Set source directory from first argument
SOURCE_DIR="$1"

# Check if source directory exists
if [ ! -d "$SOURCE_DIR" ]; then
  echo -e "${RED}Error: Source directory does not exist${NC}"
  exit 1
fi

# Create performer directories
DEST_DIR="public/images/performers"
mkdir -p "$DEST_DIR"

# Create directories for each performer
mkdir -p "$DEST_DIR/chen"      # Xingyi Betty Chen
mkdir -p "$DEST_DIR/ma"        # Haoyang Aisling Ma (no files present in the list)
mkdir -p "$DEST_DIR/edwards"   # Ryan Edwards
mkdir -p "$DEST_DIR/welch"     # Chapman Welch
mkdir -p "$DEST_DIR/patton"    # Kevin Patton (KP)
mkdir -p "$DEST_DIR/doyle"     # Kelly Doyle
mkdir -p "$DEST_DIR/trapani"   # Christopher Trapani
mkdir -p "$DEST_DIR/snyder"    # Jeff Snyder
mkdir -p "$DEST_DIR/misc"      # For miscellaneous files like audience shots

echo -e "${YELLOW}Created performer directories${NC}"

# Keep the stage background in the main images directory
if [ -f "$SOURCE_DIR/stage-background.jpg" ]; then
  cp "$SOURCE_DIR/stage-background.jpg" "public/images/"
  echo -e "${GREEN}Copied stage background to public/images/${NC}"
else
  echo -e "${YELLOW}Warning: stage-background.jpg not found in source directory${NC}"
fi

# Function to copy a file with proper messaging
copy_file() {
  local src="$1"
  local dest="$2"
  
  if [ -f "$src" ]; then
    cp "$src" "$dest"
    echo -e "${GREEN}Copied $(basename "$src") to $dest${NC}"
  else
    echo -e "${YELLOW}Warning: File $src not found${NC}"
  fi
}

# Copy Betty Chen files
echo -e "\n${BLUE}Copying Betty Chen (composer) files...${NC}"
copy_file "$SOURCE_DIR/Betty_Live-2.jpg" "$DEST_DIR/chen/"
copy_file "$SOURCE_DIR/Betty_Live1.jpg" "$DEST_DIR/chen/"
copy_file "$SOURCE_DIR/Betty_Live.mov" "$DEST_DIR/chen/"
copy_file "$SOURCE_DIR/Betty_Rig.jpg" "$DEST_DIR/chen/"

# Ryan Edwards files
echo -e "\n${BLUE}Copying Ryan Edwards files...${NC}"
copy_file "$SOURCE_DIR/Ryan_Amp.JPG" "$DEST_DIR/edwards/"
copy_file "$SOURCE_DIR/Ryan_Impliments.jpg" "$DEST_DIR/edwards/"
copy_file "$SOURCE_DIR/Ryan_Live-2.jpg" "$DEST_DIR/edwards/"
copy_file "$SOURCE_DIR/Ryan_Live-3.jpg" "$DEST_DIR/edwards/"
copy_file "$SOURCE_DIR/Ryan_Live.jpg" "$DEST_DIR/edwards/"
copy_file "$SOURCE_DIR/Ryan_Live.mov" "$DEST_DIR/edwards/"
copy_file "$SOURCE_DIR/Ryan_PreparedGuitar.jpg" "$DEST_DIR/edwards/"

# Chapman Welch files
echo -e "\n${BLUE}Copying Chapman Welch files...${NC}"
copy_file "$SOURCE_DIR/Champman_Max+Controllers.jpg" "$DEST_DIR/welch/"
copy_file "$SOURCE_DIR/Chapman_Live-1.jpg" "$DEST_DIR/welch/"
copy_file "$SOURCE_DIR/Chapman_Live-1.mov" "$DEST_DIR/welch/"
copy_file "$SOURCE_DIR/Chapman_Max.jpg" "$DEST_DIR/welch/"
copy_file "$SOURCE_DIR/Chapman_Pedals.jpg" "$DEST_DIR/welch/"
copy_file "$SOURCE_DIR/Chapman_live-2.mov" "$DEST_DIR/welch/"

# Kevin Patton (KP) files
echo -e "\n${BLUE}Copying Kevin Patton files...${NC}"
copy_file "$SOURCE_DIR/KP_Live-1.jpg" "$DEST_DIR/patton/"
copy_file "$SOURCE_DIR/KP_Live-2.jpg" "$DEST_DIR/patton/"
copy_file "$SOURCE_DIR/KP_Live-3.jpg" "$DEST_DIR/patton/"
copy_file "$SOURCE_DIR/KP_Live-4.jpg" "$DEST_DIR/patton/"
copy_file "$SOURCE_DIR/KP_Live-5.jpg" "$DEST_DIR/patton/"
copy_file "$SOURCE_DIR/KP_Live-6.jpg" "$DEST_DIR/patton/"
copy_file "$SOURCE_DIR/KP_Live-7.jpg" "$DEST_DIR/patton/"
copy_file "$SOURCE_DIR/KP_Live.MOV" "$DEST_DIR/patton/"
copy_file "$SOURCE_DIR/KP_Max.jpg" "$DEST_DIR/patton/"
copy_file "$SOURCE_DIR/KP_Pedals.JPG" "$DEST_DIR/patton/"

# Kelly Doyle files
echo -e "\n${BLUE}Copying Kelly Doyle files...${NC}"
copy_file "$SOURCE_DIR/Kelly_Amp.JPG" "$DEST_DIR/doyle/"
copy_file "$SOURCE_DIR/Kelly_Live-2.jpg" "$DEST_DIR/doyle/"
copy_file "$SOURCE_DIR/Kelly_Live-3.mov" "$DEST_DIR/doyle/"
copy_file "$SOURCE_DIR/Kelly_Live.jpg" "$DEST_DIR/doyle/"
copy_file "$SOURCE_DIR/Kelly_Pedals-2.jpg" "$DEST_DIR/doyle/"
copy_file "$SOURCE_DIR/Kelly_Pedals.jpg" "$DEST_DIR/doyle/"

# Christopher Trapani files
echo -e "\n${BLUE}Copying Christopher Trapani files...${NC}"
copy_file "$SOURCE_DIR/Trapani_Amp.JPG" "$DEST_DIR/trapani/"
copy_file "$SOURCE_DIR/Trapani_Live-1.jpg" "$DEST_DIR/trapani/"
copy_file "$SOURCE_DIR/Trapani_Live-2.jpg" "$DEST_DIR/trapani/"
copy_file "$SOURCE_DIR/Trapani_Live.mov" "$DEST_DIR/trapani/"
copy_file "$SOURCE_DIR/Trapani_Max.jpg" "$DEST_DIR/trapani/"
copy_file "$SOURCE_DIR/Trapani_Pedals.jpg" "$DEST_DIR/trapani/"

# Jeff Snyder files
echo -e "\n${BLUE}Copying Jeff Snyder files...${NC}"
copy_file "$SOURCE_DIR/Jeff-trapani_Live-1.jpg" "$DEST_DIR/snyder/"
copy_file "$SOURCE_DIR/JeffSillyFace.JPG" "$DEST_DIR/snyder/"
copy_file "$SOURCE_DIR/Jeff_Live-1.jpg" "$DEST_DIR/snyder/"
copy_file "$SOURCE_DIR/Jeff_Live-2.mov" "$DEST_DIR/snyder/"
copy_file "$SOURCE_DIR/Jeff_Pedals.JPG" "$DEST_DIR/snyder/"
copy_file "$SOURCE_DIR/Jeff_mixer.JPG" "$DEST_DIR/snyder/"

# Jeff and Trapani joint video
echo -e "\n${BLUE}Copying Jeff & Trapani joint video...${NC}"
copy_file "$SOURCE_DIR/Jeff-Trapani_Live.mov" "$DEST_DIR/misc/"

# Miscellaneous files
echo -e "\n${BLUE}Copying miscellaneous files...${NC}"
copy_file "$SOURCE_DIR/Audience.jpg" "$DEST_DIR/misc/"
copy_file "$SOURCE_DIR/VAnBergeijk.JPG" "$DEST_DIR/misc/"

echo -e "\n${GREEN}Media organization complete!${NC}"
echo -e "${YELLOW}Files have been organized in the $DEST_DIR directory${NC}"

# Count files for verification
echo -e "\n${BLUE}File count by performer:${NC}"
echo "Betty Chen: $(ls -1 $DEST_DIR/chen | wc -l) files"
echo "Haoyang Ma: $(ls -1 $DEST_DIR/ma | wc -l) files"
echo "Ryan Edwards: $(ls -1 $DEST_DIR/edwards | wc -l) files"
echo "Chapman Welch: $(ls -1 $DEST_DIR/welch | wc -l) files"
echo "Kevin Patton: $(ls -1 $DEST_DIR/patton | wc -l) files"
echo "Kelly Doyle: $(ls -1 $DEST_DIR/doyle | wc -l) files"
echo "Christopher Trapani: $(ls -1 $DEST_DIR/trapani | wc -l) files"
echo "Jeff Snyder: $(ls -1 $DEST_DIR/snyder | wc -l) files"
echo "Miscellaneous: $(ls -1 $DEST_DIR/misc | wc -l) files"