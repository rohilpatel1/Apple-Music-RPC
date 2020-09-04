const { execSync, exec } = require("child_process");

class iTunes {
  constructor() {
    this.data = {};
    this.currentSong = {};

    this.setup();
  }

  setup() {
    try {
      this.currentSong = JSON.parse(execSync("cscript //Nologo ./libs/iTunesBridge/iTunesBridgeWS.js currentTrack", { encoding: "utf8" }));
    } catch (e) {
      this.currentSong = {
        "state": "loading/not playing"
      };
    }
  }

  getCurrentSong() {
    return this.currentSong;
  }
}

module.exports = iTunes;