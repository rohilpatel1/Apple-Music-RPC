const { app, BrowserWindow } = require('electron');
const { execSync } = require("child_process");
const client = require("discord-rich-presence")('749704287176622170');

const iTunes = require("./libs/iTunesBridge/iTunesBridge");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let port = 65516;

let screenSize = {
  width: 400,
  height: 300
};

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: screenSize.width,
    height: screenSize.height,
    webPreferences: {
      nodeIntegration: true
    },
    autoHideMenuBar: true
  })

  // and load the index.html of the app.
  // Open the DevTools.
  //win.webContents.openDevTools()
  setTimeout(loadUrl, 1000);

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  });
}

function loadUrl() {
  win.loadURL('http://localhost:' + port + '/');

  setupRPC();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

app.on('certificate-error', function(event, webContents, url, error,
  certificate, callback) {
      event.preventDefault();
      callback(true);
});

/* RPC BELOW */

const iTunesApp = new iTunes();
let RPCInterval = 0;
let lastSong = "";
let startDate = new Date();

function setupRPC() {
  updatePresence();
  RPCInterval = setInterval(updatePresence, 1000);
}

function updatePresence() {
  const currentSong = iTunesApp.getCurrentSong();
  let state = currentSong.state;

  const fullTitle = `${currentSong.artist || "No Artist"} - ${currentSong.name}`;
  
  if (state == "Playing" && (fullTitle !== lastSong || !lastSong)) {
    startDate = new Date();
    lastSong = `${currentSong.artist || "No Artist"} - ${currentSong.name}`;
    startDate.setSeconds(new Date().getSeconds() - parseInt(currentSong.elapsed));
  }

  client.updatePresence({
    state: (state == "Playing") ? `by ${currentSong.artist || "No Artist"}` : state,
    details: currentSong.name,
    startTimestamp: (state == "Playing") ? startDate.getTime() : Date.now(),
    largeImageKey: 'music',
    smallImageKey: (state == "Playing") ? "pause" : "play",
    smallImageText: state,
    largeImageText: (state == "Playing") ? `${fullTitle}` : "Idling",
    instance: true,
  });
}