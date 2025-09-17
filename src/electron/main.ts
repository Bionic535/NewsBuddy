import { app, BrowserWindow, desktopCapturer, globalShortcut } from "electron";  
import * as path from "path";
import { ipcMainHandle, isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { aiCall } from "./openai.js";
import { kMaxLength } from "buffer";
import { glob } from "fs";
import * as fs from "fs";
import OpenAI from "openai";
import client from "openai";
let mainWindow: BrowserWindow;
app.on("ready", () => {
        mainWindow = new BrowserWindow({
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
    registerGlobalShortcuts();
    mainWindow.on("closed", () => {
        app.quit();
    });

});

function registerGlobalShortcuts() {
    const showHideKey = process.platform === "darwin" ? "Command+Shift+H" : "Control+Shift+H";
    globalShortcut.register(showHideKey, () => {
        if (mainWindow.isVisible()) {
            mainWindow.hide();
        } else {
            mainWindow.show();
        }

    });
    globalShortcut.register('CommandOrControl+Shift+S', async () => {
        const result = await takeChromeScreenshot();
        if (result && mainWindow) {
            mainWindow.show();
            mainWindow.focus();
            mainWindow.webContents.send('screenshot-taken', result);
        }
    });
    if (isDev()) {
        globalShortcut.register('F12', () => {
            if (mainWindow) {
                mainWindow.webContents.toggleDevTools();
            }
        });
    }
    console.log(`Global shortcut registered: ${showHideKey}`);
}
// Clean up shortcuts when app is quitting
app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
    }
});

async function takeChromeScreenshot() {
    try {
        const sources = await desktopCapturer.getSources({ types: ['window'] });
        const chromeWindows = sources.filter(source => {
            const name = source.name.toLowerCase();
            return name.includes('chrome') ||
                   name.includes('google chrome') ||
                   name.includes('chromium') ||
                   name.includes('microsoft edge') ||
                   name.includes('brave');
        });
        if (chromeWindows.length == 0) {
            console.error("No Chrome windows found.");
            return;
        }

        console.log(`Found ${chromeWindows.length} Chrome windows.`);
        // Use the first Chrome window
        const targetWindow = chromeWindows[0];
        
        // Get screenshot as PNG buffer (raw bytes)
        const screenshotBuffer = targetWindow.thumbnail.toPNG();
        
        // Convert to base64 for OpenAI API
        const base64Image = screenshotBuffer.toString('base64');
        
        // Optional: Also save to disk for debugging/backup
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const screenshotPath = path.join(
            app.getPath('desktop'), 
            `chrome-tab-${timestamp}.png`
        );
        fs.writeFileSync(screenshotPath, screenshotBuffer);
        
        console.log(`Chrome tab screenshot saved to: ${screenshotPath}`);
        
        return {
            success: true,
            path: screenshotPath,
            windowName: targetWindow.name,
            timestamp: new Date().toISOString(),
            // These are what you need for OpenAI:
            buffer: screenshotBuffer,        // Raw PNG data
            base64: base64Image,            // Base64 encoded for API
            dataUrl: `data:image/png;base64,${base64Image}` // Complete data URL
        };
    } catch (error) {
        console.error("Error capturing screen:", error);
        
    }
} 
async function apiCall(link: string, calltype: string): Promise<{ output_text: string } | undefined> {
    try {
        const response = await aiCall(link, calltype);
        console.log("AI Call Response:", response);
        return response;
    } catch (error) {
        console.error("Error during AI call:", error);
    }
}

