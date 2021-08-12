import { app, BrowserWindow, screen, nativeImage, shell, Menu, Tray } from "electron";
import Path from "path";
import config from "./config";

let window: BrowserWindow | null;
let tray: Tray;

const icon = nativeImage.createFromPath(Path.join(config.assetPath, config.iconPath));
const activate = () => window && !window.isVisible() && window.show();

app.setName(config.productName);
app.name = config.appName;

function main() {
  // Initialize
  if (!app.requestSingleInstanceLock()) return app.quit();

  app.on("ready", () => {
    createWindow();
    createTray();
  }).on("before-quit", () => {
    app.releaseSingleInstanceLock();
    if (window) window.destroy();
  }).on("activate", () => {
    activate();
  }).on("second-instance", () => {
    activate();
  });
}
main();

/// Functions
function createTray() {
  const contextMenu = Menu.buildFromTemplate([
    { label: "Quit", click() { app.quit(); } }
  ]);
  tray = new Tray(icon);
  tray.setToolTip(config.productName);
  tray.setContextMenu(contextMenu);
}

function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().size;
  window = new BrowserWindow({
    width: width,
    height: height,

    title: config.productName,
    icon: nativeImage.createFromPath(Path.join(config.assetPath, config.iconPath)),

    backgroundColor: "#000000",
    darkTheme: true,
    titleBarStyle: "hiddenInset",
    fullscreenWindowTitle: false,
    thickFrame: true,
    frame: true,
    autoHideMenuBar: true,

    webPreferences: {
      experimentalFeatures: true,
      nativeWindowOpen: false,
      nodeIntegration: false,
      preload: Path.join(app.getAppPath(), "preload.js"),
      partition: "persist:ytmusic",
    },
    show: false,
  });

  window.loadURL(config.targetUrl);
  window.once("ready-to-show", window.show);

  // Remove reference to non-existent window
  window.on("closed", () => {
    window = null;
  });

  // Hide window when closing was prevented
  window.webContents.on("will-prevent-unload", () => {
    if (window) window.hide();
  });

  // Prevent going outside of allowed zone
  window.webContents.on("will-navigate", (ev, aUrl) => {
    const url = new URL(aUrl);

    if (!config.allowedHosts.includes(url.host)) {
      ev.preventDefault();
      shell.openExternal(aUrl);
      if (window) window.webContents.loadURL(config.targetUrl);
    }
  });

  // Open in system browser, not in electron
  window.webContents.setWindowOpenHandler(ev => {
    shell.openExternal(ev.url);
    return { action: "deny" };
  });
}
