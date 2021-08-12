import { app } from "electron";
import Path from "path";

export default {
  assetPath: Path.join(app.isPackaged ? process.resourcesPath : process.cwd(), "resources"),
  appName: "zhins-youtube-music",
  productName: "YouTube Music",
  targetUrl: "https://music.youtube.com/",
  iconPath: "ytm.png",
  allowedHosts: [
    "accounts.google.com",
    "accounts.youtube.com",
    "music.youtube.com",
  ],
};
