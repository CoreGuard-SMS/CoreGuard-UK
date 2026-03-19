# CoreGuard Control - Desktop Application

A lightweight, secure desktop wrapper for the CoreGuard SMS platform built with Electron.

## Features

- **Secure Browser Wrapper**: Loads CoreGuard web app in a secure Electron container
- **Offline Support**: Shows custom "No Connection" screen when offline
- **Session Persistence**: Maintains login sessions across app restarts
- **Control Room Features**: Always-on-top toggle for control room use
- **Auto Updates**: Built-in auto-update support
- **Cross-Platform**: Windows support (ready for macOS/Linux expansion)
- **Security Hardened**: Disabled node integration, context isolation, domain restrictions

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Create Windows installer
npm run dist
```

### Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build TypeScript files
npm run pack         # Package without creating installer
npm run dist         # Create distributable packages
```

## Configuration

### Environment Variables

- `COREGUARD_URL`: Target web app URL (default: https://app.coreguardsms.co.uk)
- `ALLOWED_DOMAINS`: Comma-separated list of allowed domains

### Security Settings

The app is configured with maximum security:
- ❌ Node integration disabled
- ✅ Context isolation enabled
- ✅ Web security enabled
- ✅ Domain restrictions enforced
- ✅ External links open in default browser

## Window Controls

### Keyboard Shortcuts

- `Ctrl + R`: Reload application
- `Ctrl + T`: Toggle always-on-top mode
- `Ctrl + Shift + D`: Toggle Dev Tools (development mode only)

### Menu Options

- **File**: Reload, Toggle Always on Top, Quit
- **View**: Zoom controls, Fullscreen toggle
- **Window**: Minimize, Close
- **Help**: About dialog

## Project Structure

```
/electron
├── main.ts              # Main Electron process
├── preload.ts           # Preload script for security
├── renderer/
│   └── index.ts         # Minimal renderer (loading screen)
├── assets/
│   └── icon.ico         # Application icon
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── tsconfig.main.json   # Main process TypeScript config
├── tsconfig.renderer.json # Renderer process TypeScript config
└── README.md            # This file
```

## Building for Distribution

### Windows

```bash
# Build Windows installer
npm run dist

# Output: release/CoreGuard Control Setup X.X.X.exe
```

### Auto Updates

The app is configured for auto-updates using GitHub Releases:

1. Create a new release on GitHub
2. The app will automatically check for updates
3. Users will be prompted to install updates

## Security Considerations

### Domain Restrictions
- Only allows navigation to `app.coreguardsms.co.uk` and `coreguardsms.co.uk`
- External links are opened in the default browser
- File:// protocol access is blocked

### Process Isolation
- Main process: Handles app lifecycle and security
- Renderer process: Only displays web content
- Preload script: Secure bridge between processes

### Session Management
- Sessions are persisted using Electron's session storage
- Sessions are only cleared on explicit logout
- No sensitive data is stored in local files

## Troubleshooting

### Common Issues

1. **App won't start**: Check Node.js version and run `npm install`
2. **Blank screen**: Check internet connection and target URL
3. **Dev Tools not working**: Enable development mode with `--dev` flag
4. **Auto-update not working**: Check GitHub repository configuration

### Debug Mode

```bash
# Run with debug logging
DEBUG=* npm run dev

# Enable Dev Tools in production
npm run dev -- --dev
```

## License

MIT License - see LICENSE file for details.

## Support

For support, contact CoreGuard at support@coreguardsms.co.uk
