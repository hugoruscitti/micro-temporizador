const { app, Menu, BrowserWindow, ipcMain, Tray } = require("electron");
const path = require("path");

let mainWindow;
let tray = undefined;
const recursos = path.join(__dirname, "recursos");

function createWindow() {
  mainWindow = new BrowserWindow({
    x: 200,
    width: 140,
    height: 80,
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
  //#tray = new Tray(path.join(recursos, "icono.png"));
  tray = new Tray(path.join(recursos, "icono.png"));
  tray.on("right-click", toggleWindow);
  tray.on("double-click", toggleWindow);

  //tray.setTitle("27'")

  /*
  const contextMenu = Menu.buildFromTemplate([
    {label: 'Item1', type: 'radio'},
    {label: 'Item2', type: 'radio'},
    {label: 'Item3', type: 'radio', checked: true},
    {label: 'Item4', type: 'radio'}
  ])

  tray.setContextMenu(contextMenu)
  */

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

ipcMain.on("actualizar-tray", function(event, arg) {
  tray.setTitle(arg);
});

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

  let displays = require("electron").screen.getAllDisplays();
  let width = displays[0].bounds.width;
  let height = displays[0].bounds.height;

  mainWindow.setPosition(width - 143, height - 0);
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
