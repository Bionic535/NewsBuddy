import {} from "electron";
import { app, BrowserWindow } from "electron";  
import * as path from "path";
import { ipcMainHandle, isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { ai_call } from "./openai.js";

app.on("ready", () => {
    const mainWindow = new BrowserWindow({
        webPreferences: {
            preload: getPreloadPath()
        },
    });
    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123");
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(app.getAppPath() + "/dist-react/index.html"));
    }
    ipcMainHandle('ai_call', async (functype: string, link: string) => {
        return await apiCall(functype, link);
    });
    mainWindow.on("closed", () => {
        app.quit();
    });

});

async function apiCall(functype: string, link: string): Promise<{ output_text: string } | undefined> {
    try {
        const response = await ai_call(functype, link);
        console.log("AI Call Response:", response);
        return response;
    } catch (error) {
        console.error("Error during AI call:", error);
    }
}

