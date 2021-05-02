const { execSync, exec } = require("child_process");
const Path = require("path");
const os = require("os");

const LIBPATHWS = Path.join(process.resourcesPath, "./app/libs/iTunesBridge/iTunesBridgeWS.js");
const LIBPATHOS = Path.join(process.resourcesPath, "./app/libs/iTunesBridge/iTunesBridgeOA.js");

class iTunes {
  constructor() {
    this.data = {};
    this.currentSong = {};

    this.setup();
  }

  setup() {
    try {
      if (os.platform() == "win32") {
        this.currentSong = JSON.parse(execSync(`cscript //Nologo "${LIBPATHWS}" currentTrack`, { encoding: "utf8" }));
      } else if (os.platform() == "darwin") {
        this.currentSong = JSON.parse(execSync(`osascript "${LIBPATHOS}" currentTrack`, { encoding: "utf8" }));
      }
    } catch (e) {
      this.currentSong = {
        "state": "loading/not playing"
      };
    }
  }

  exec(option) {
    if (os.platform() == "win32") {
      return JSON.parse(execSync(`cscript //Nologo "${LIBPATHWS}" ${option}`, { encoding: "utf8" }));
    } else if (os.platform() == "darwin") {
      return JSON.parse(execSync(`osascript "${LIBPATHOS}" ${option}`, { encoding: "utf8" }));
    }
  }

  getCurrentSong() {
    if (os.platform() == "win32") {
      this.currentSong = JSON.parse(execSync(`cscript //Nologo "${LIBPATHWS}" currentTrack`, { encoding: "utf8" }));
    } else if (os.platform() == "darwin") {
      this.currentSong = JSON.parse(execSync(`osascript "${LIBPATHOS}" currentTrack`, { encoding: "utf8" }));
    }
    return this.currentSong;
  }
}

module.exports = iTunes;
