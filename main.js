const { app, BrowserWindow, ipcMain, Tray } = require("electron");
const path = require("path");

let mainWindow;
let tray = undefined;
const recursos = path.join(__dirname, "recursos");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 175,
    height: 175,
    titleBarStyle: "customButtonsOnHover",
    frame: false,
    alwaysOnTop: true,
    vibrancy: "dark", //"light",
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile("index.html");

  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

const createTray = () => {
  tray = new Tray(path.join(recursos, "icono.png"));
  tray.on("right-click", toggleWindow);
  tray.on("double-click", toggleWindow);

  tray.on("click", function(event) {
    toggleWindow();

    /*
    // Show devtools when command clicked
    if (window.isVisible() && process.defaultApp && event.metaKey) {
      window.openDevTools({mode: 'detach'})
    }
    */
  });
};

const toggleWindow = () => {
  if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    showWindow();
  }
};

const showWindow = () => {
  mainWindow.show();
  mainWindow.focus();
};

app.dock.hide();
app.on("ready", () => {
  createWindow();
  createTray();
});

app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  if (mainWindow === null) {
    createWindow();
  }
});
