import { app, BrowserWindow, ipcMain, Notification } from "electron";
import { registerNotifications } from "./notifications.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
if (process.platform === "win32") app.setAppUserModelId(app.isPackaged ? "com.ayxx.office" : process.execPath);

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 900,
    minWidth: 1024,
    minHeight: 720,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  } else {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools({ mode: "detach" });
  }
}

app.whenReady().then(() => {
  registerNotifications({ ipcMain, BrowserWindow, Notification });
  ipcMain.on("window-control", (event, action) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win || event.senderFrame !== win.webContents.mainFrame) return;
    if (action === "close") win.close();
    if (action === "minimize") win.minimize();
    if (action === "fullscreen") win.setFullScreen(!win.isFullScreen());
  });
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
