import { app, BrowserWindow, Menu, ipcMain, shell, dialog, globalShortcut } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as path from 'path';
import { URL } from 'url';

// Configuration
const COREGUARD_URL = 'https://app.coreguardsms.co.uk';
const ALLOWED_DOMAINS = ['app.coreguardsms.co.uk', 'coreguardsms.co.uk'];
const MIN_WIDTH = 1200;
const MIN_HEIGHT = 800;

let mainWindow: BrowserWindow | null = null;
let isDevMode = process.argv.includes('--dev');

// Auto updater configuration
autoUpdater.checkForUpdatesAndNotify();

function createWindow(): void {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: MIN_WIDTH,
    minHeight: MIN_HEIGHT,
    show: false,
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../assets/icon.ico'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true,
      allowRunningInsecureContent: false,
      experimentalFeatures: false
    },
    title: 'CoreGuard Control'
  });

  // Load the app
  mainWindow.loadURL(COREGUARD_URL);

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    if (!isDevMode) {
      mainWindow?.maximize();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle navigation events (security)
  mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    
    if (!ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
      event.preventDefault();
      shell.openExternal(navigationUrl);
    }
  });

  // Handle new window creation (security)
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const parsedUrl = new URL(url);
    
    if (ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
      return { action: 'allow' };
    } else {
      shell.openExternal(url);
      return { action: 'deny' };
    }
  });

  // Handle console errors
  mainWindow.webContents.on('console-message', (event, level, message, line, sourceId) => {
    if (level === 3) { // 3 is error level in Electron
      console.error('Renderer Error:', message, 'at', sourceId + ':' + line);
    }
  });

  // Handle page load failures
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription, validatedURL) => {
    console.error('Failed to load:', errorCode, errorDescription);
    showOfflinePage();
  });

  // Setup application menu
  setupMenu();

  // Setup global shortcuts
  setupGlobalShortcuts();
}

function setupMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            mainWindow?.webContents.reload();
          }
        },
        {
          label: 'Toggle Always on Top',
          accelerator: 'CmdOrCtrl+T',
          click: () => {
            if (mainWindow) {
              mainWindow.setAlwaysOnTop(!mainWindow.isAlwaysOnTop());
            }
          }
        },
        { type: 'separator' },
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About CoreGuard Control',
          click: () => {
            dialog.showMessageBox(mainWindow!, {
              type: 'info',
              title: 'About CoreGuard Control',
              message: 'CoreGuard Control',
              detail: 'Version: ' + app.getVersion() + '\nA secure desktop wrapper for CoreGuard SMS platform.\n\n© 2024 CoreGuard'
            });
          }
        }
      ]
    }
  ];

  // Add Dev Tools menu in development mode
  if (isDevMode) {
    template.push({
      label: 'Development',
      submenu: [
        {
          label: 'Toggle Dev Tools',
          accelerator: 'Ctrl+Shift+D',
          click: () => {
            mainWindow?.webContents.toggleDevTools();
          }
        }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function setupGlobalShortcuts(): void {
  // Ctrl+R: Reload
  globalShortcut.register('CommandOrControl+R', () => {
    mainWindow?.webContents.reload();
  });

  // Ctrl+Shift+D: Toggle Dev Tools (dev mode only)
  if (isDevMode) {
    globalShortcut.register('CommandOrControl+Shift+D', () => {
      mainWindow?.webContents.toggleDevTools();
    });
  }
}

function showOfflinePage(): void {
  if (mainWindow) {
    const offlineHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>No Connection - CoreGuard Control</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f8f9fa;
            margin: 0;
            padding: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .container {
            text-align: center;
            max-width: 400px;
            padding: 2rem;
          }
          .icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }
          h1 {
            color: #333;
            margin-bottom: 1rem;
          }
          p {
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.5;
          }
          .btn {
            background: #007bff;
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
          }
          .btn:hover {
            background: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="icon">🔒</div>
          <h1>No Connection</h1>
          <p>Unable to connect to CoreGuard SMS. Please check your internet connection and try again.</p>
          <button class="btn" onclick="location.reload()">Retry</button>
        </div>
      </body>
      </html>
    `;
    
    mainWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(offlineHtml)}`);
  }
}

// App event handlers
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Auto updater events
autoUpdater.on('update-available', () => {
  dialog.showMessageBox(mainWindow!, {
    type: 'info',
    title: 'Update Available',
    message: 'A new version of CoreGuard Control is available.',
    detail: 'The update will be downloaded in the background.'
  });
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(mainWindow!, {
    type: 'info',
    title: 'Update Ready',
    message: 'A new version of CoreGuard Control is ready to install.',
    detail: 'The application will restart to complete the update.',
    buttons: ['Restart Now', 'Later']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    const parsedUrl = new URL(url);
    
    if (ALLOWED_DOMAINS.includes(parsedUrl.hostname)) {
      return { action: 'allow' };
    } else {
      shell.openExternal(url);
      return { action: 'deny' };
    }
  });
});

// Clean up global shortcuts
app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
