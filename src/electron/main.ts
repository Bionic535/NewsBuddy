import { app, BrowserWindow } from "electron";  
import * as path from "path";
import { ipcMainHandle, isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { aiCall } from "./openai.js";

app.on("ready", () => {
        const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath(),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123");
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
    }
    ipcMainHandle('aiCall', async (link: string, calltype: string) => {
        return await apiCall(link, calltype);
    });
    mainWindow.on("closed", () => {
        app.quit();
    });

});

async function apiCall(link: string, calltype: string): Promise<{ output_text: string } | undefined> {
    try {
        const response = await aiCall(link, calltype);
        console.log("AI Call Response:", response);
        return response;
    } catch (error) {
        console.error("Error during AI call:", error);
    }
}

