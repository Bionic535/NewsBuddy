import {} from "electron";
import { app, BrowserWindow } from "electron";  
import * as path from "path";
import { isDev } from "./util.js";

app.on("ready", () => {
    const mainWindow = new BrowserWindow({});
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123");
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
    }
});