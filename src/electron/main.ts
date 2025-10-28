import { app, BrowserWindow, desktopCapturer, globalShortcut, Menu, screen, Tray } from "electron";  
import * as path from "path";
import { ipcMainHandle, isDev } from "./util.js";
import { getIconPath, getPreloadPath } from "./pathResolver.js";
import { aiCall, apiImageCall } from "./openai.js";
import { kMaxLength } from "buffer";
import { glob } from "fs";
import * as fs from "fs";
import OpenAI from "openai";
import client from "openai";
let mainWindow: BrowserWindow;
let summary: { output_text: string; } | undefined;
let factcheck: { output_text: string; } | undefined;

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
    ipcMainHandle('apiImageCall', async (imageBase64: string) => {
        return await apiImageCall(imageBase64);
    });
    registerGlobalShortcuts();
    mainWindow.on("closed", () => {
        app.quit();
    });

    const tray = new Tray(getIconPath());
    const trayMenu = Menu.buildFromTemplate([
        { label: 'Show', click: () => { 
            if (mainWindow) {
                mainWindow.show(); 
                mainWindow.restore?.();
                mainWindow.focus();
                if (app.dock) app.dock.show();
            }
        } },
        { label: 'Quit', click: () => {app.quit(); } }
    ]);
    tray.setToolTip('NewsBuddy');
    tray.setContextMenu(trayMenu);
    tray.on('click', () => {
        if (mainWindow) {
            mainWindow.show();
            mainWindow.restore?.();
            mainWindow.focus();
            if (app.dock) app.dock.show();
        }
    });
    handleCloseEvents(mainWindow);
});

function handleCloseEvents(mainWindow: BrowserWindow) {
    let willClose = false;
    mainWindow.on('close', (e) => {
        if (willClose) {
            return;
        }
        e.preventDefault();
        mainWindow.hide();
        if (app.dock) {
            app.dock.hide();
        }
    });

    app.on('before-quit', () => {
        willClose = true;
    });
    mainWindow.on('show', () => {
        willClose = false;
    });
}
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
        console.log("in summarize shortcut");   
        if (result && mainWindow) {
            mainWindow.show();
            mainWindow.focus();
            const response = await aiImageCall(result.base64);
            console.log(response?.output_text);
            if (response?.output_text) {
                summary = await apiCall(response.output_text, "summarize");
            }
            if (summary) {
                mainWindow.webContents.send('screenshot-taken', summary.output_text);
            }
        }
    });
    globalShortcut.register('CommandOrControl+Shift+C', async () => {
        const result = await takeChromeScreenshot();
        console.log("in fact-check shortcut");
        if (result && mainWindow) {
            mainWindow.show();
            mainWindow.focus();
            const response = await aiImageCall(result.base64);
            console.log(response?.output_text);
            if (response?.output_text) {
                factcheck = await apiCall(response.output_text, "fact-check");
            }
            if (factcheck) {
                mainWindow.webContents.send('screenshot-taken', factcheck.output_text);
            }
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
        const { width, height } = screen.getPrimaryDisplay().workAreaSize;
        const thumbnailSize = { width, height };
        const sources = await desktopCapturer.getSources({ 
            types: ['window'],
            thumbnailSize 
        });
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

async function aiImageCall(imageBase64: string): Promise<{ output_text: string } | undefined> {
    console.log("Received image for processing.");
    try {
        const response = await apiImageCall(imageBase64);
        console.log("API Image Call Response:", response);
        return response;
    } catch (error) {
        console.error("Error during API image call:", error);   
    }
}