# PWA Icons

This directory should contain the Progressive Web App icons for the Reddit Client application.

## Required Icons

### icon-192.png
- **Size:** 192x192 pixels
- **Format:** PNG
- **Purpose:** Standard app icon for PWA installation
- **Design:** Reddit orange (#FF4500) background with white symbol

### icon-512.png
- **Size:** 512x512 pixels  
- **Format:** PNG
- **Purpose:** High-resolution app icon for PWA installation
- **Design:** Reddit orange (#FF4500) background with white symbol

## Current Status

⚠️ **PLACEHOLDER FILES ONLY**

The current `.placeholder` files are documentation only. Actual PNG icon files need to be created manually.

## How to Create Icons

### Option 1: Design Tools
1. Use Figma, Canva, Adobe Express, or similar
2. Create a square canvas (192x192 or 512x512)
3. Fill with #FF4500 (Reddit orange)
4. Add a white symbol (antenna, "R" letter, or simple icon)
5. Export as PNG

### Option 2: Online Generators
- https://realfavicongenerator.net/
- https://favicon.io/
- https://www.pwabuilder.com/

### Option 3: SVG to PNG
Create an SVG file and convert to PNG at appropriate sizes.

### Quick Testing Option
For development purposes, you can use simple colored square images or even skip them temporarily. The PWA will still function, but installation prompts may look less polished.

## Files Referenced In

- `/public/manifest.json` - PWA manifest
- `/vite.config.js` - VitePWA plugin configuration
- `/index.html` - Apple touch icon link

## Notes

PWA icons are required for:
- Installation prompts on mobile devices
- Home screen shortcuts
- App switcher displays
- Splash screens on some platforms
