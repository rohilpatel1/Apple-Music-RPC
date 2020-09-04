const APP = Application.currentApplication();
const iTunesApp = Application('iTunes');

ObjC.import('Foundation');
const argv = $.NSProcessInfo.processInfo.arguments.js;

function getPlayerState() {
  if (!iTunesApp) return "Not Opened";
  return iTunesApp.playerState();
}

function getCurrentTrack() {
  var data = {};
  try {
    var currentTrack = iTunesApp.currentTrack;
    data = {
      name: currentTrack.name(),
      artist: currentTrack.artist(),
      album: currentTrack.album(),
      kind: currentTrack.kind(),
      duration: currentTrack.duration(),
      genre: currentTrack.genre(),
      year: currentTrack.year(),
      elapsed: iTunesApp.PlayerPosition(),
      state: getPlayerState()
    };
  } catch (e) {
    data = {
      state: getPlayerState()
    };
  }

  return JSON.stringify(data);
}

switch(argv[0]) {
  case "currentTrack":
    return getCurrentTrack();
  case "playerState":
    return getPlayerState();
  case "play":
    iTunes.play();
    break;
}