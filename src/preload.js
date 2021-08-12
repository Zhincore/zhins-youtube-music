const { ipcRenderer } = require("electron");

const ButtonFactory = selector => () => document.querySelector(selector);
const buttons = {
  playPause: ButtonFactory(".ytmusic-player-bar.play-pause-button"),
};

ipcRenderer.on("MediaPlayPause", () => {
  console.log("a");
  buttons.playPause().click();
});
