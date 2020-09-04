const { execSync, exec } = require("child_process");
const os = require("os");

class iTunes {
  constructor() {
    this.data = {};
    this.currentSong = {};

    this.setup();
  }

  setup() {
    try {
      if (os.platform() == "win32") {
        this.currentSong = JSON.parse(execSync("cscript //Nologo ./libs/iTunesBridge/iTunesBridgeWS.js currentTrack", { encoding: "utf8" }));
      } else if (os.platform() == "darwin") {
        this.currentSong = JSON.parse(execSync(`osascript ./libs/iTunesBridge/iTunesBridgeOA.js currentTrack`, { encoding: "utf8" }));
      }
    } catch (e) {
      this.currentSong = {
        "state": "loading/not playing"
      };
    }
  }

  exec(option) {
    if (os.platform() == "win32") {
      return JSON.parse(execSync("cscript //Nologo ./libs/iTunesBridge/iTunesBridgeWS.js " + option, { encoding: "utf8" }));
    } else if (os.platform() == "darwin") {
      return JSON.parse(execSync(`osascript ./libs/iTunesBridge/iTunesBridgeOA.js ${option}`, { encoding: "utf8" }));
    }
  }

  getCurrentSong() {
    if (os.platform() == "win32") {
      this.currentSong = JSON.parse(execSync("cscript //Nologo ./libs/iTunesBridge/iTunesBridgeWS.js currentTrack", { encoding: "utf8" }));
    } else if (os.platform() == "darwin") {
      this.currentSong = JSON.parse(execSync(`osascript ./libs/iTunesBridge/iTunesBridgeOA.js currentTrack`, { encoding: "utf8" }));
    }
    return this.currentSong;
  }
}

module.exports = iTunes;