const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow;
const isDev = !app.isPackaged;

function createWindow() {
  const iconPath = path.join(__dirname, isDev ? "build/icon.ico" : "dist/icon.ico");

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "BeeConnect",
    icon: iconPath,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "dist/index.html"));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});