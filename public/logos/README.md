# Logo Instructions

This directory contains the logos for CoreGuard SMS.

## Required Files:

1. **company-logo.png** - Logo for the company portal (recommended size: 32x32px)
2. **employee-logo.png** - Logo for the employee portal (recommended size: 32x32px)

## Logo Specifications:

- **Format**: PNG (with transparency) or SVG
- **Size**: 32x32 pixels (will be scaled to fit w-8 h-8 container)
- **Background**: Should work well on both light and dark themes
- **Style**: Clean, professional, recognizable at small size

## Alternative Options:

If you want to use the same logo for both portals, you can:
1. Use the same file for both logos
2. Modify the code in `components/app-sidebar.tsx` to use a single logo

## Fallback:

If the logo files fail to load, the system will automatically fall back to the shield icon.

## Adding Your Logos:

1. Place your logo files in this directory
2. Make sure they're named exactly as shown above
3. Restart your development server to see the changes
