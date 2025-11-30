import { app, BrowserWindow, desktopCapturer, globalShortcut, screen, ipcMain } from "electron";  
import * as path from "path";
import { fileURLToPath } from "url";
import { ipcMainHandle, isDev } from "./util.js";
import { getPreloadPath } from "./pathResolver.js";
import { aiCall, apiImageCall } from "./openai.js";
import Store from "electron-store";

if (!isDev()) {
    app.setName('NewsBuddy');
}


let store = new Store({ name: app.getName() });


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow;
let summary: { output_text: string; } | undefined;
let factcheck: { output_text: string; } | undefined;

ipcMain.on('setApiKey', (_, apiKey: string) => {
    store.set('apiKey', apiKey);
});

ipcMainHandle('getApiKey', async () => {
    return store.get('apiKey') as string;
});

ipcMainHandle('aiCall', async (link: string, calltype: string) => {
    const apiKey = store.get('apiKey') as string;
    return await apiCall(link, calltype, apiKey);
});

ipcMainHandle('apiImageCall', async (imageBase64: string) => {
    const apiKey = store.get('apiKey') as string;
    return await apiImageCall(imageBase64, apiKey);
});

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        autoHideMenuBar: true,
        webPreferences: {
            preload: getPreloadPath(),
            contextIsolation: true,
            nodeIntegration: false,
        },
    });
    mainWindow.setMenu(null);

    // Add CSP headers with development-friendly settings
    mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
        callback({
            responseHeaders: {
                ...details.responseHeaders,
                'Content-Security-Policy': [
                    "default-src 'self' ",
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                    "style-src 'self' 'unsafe-inline'",
                    "img-src 'self' data: https:",
                    "connect-src 'self' https://api.openai.com ws://localhost:5173",
                    "worker-src 'self' blob:",
                    isDev() ? "script-src-elem 'self' 'unsafe-inline'" : ""
                ].filter(Boolean).join('; ')
            }
        });
    });

    if (isDev()) {
        mainWindow.loadURL("http://localhost:5123");
        mainWindow.webContents.openDevTools();
    } else {
        // Use loadFile with the correct path
        const indexPath = path.join(__dirname, "..", "dist-react", "index.html");
        mainWindow.loadFile(indexPath);
    }
    registerGlobalShortcuts();
    mainWindow.webContents.send('log-message', 'shortcuts registered');
    mainWindow.on("closed", () => {
        app.quit();
    });

        // Existing `handleCloseEvents` function call
        handleCloseEvents(mainWindow);
    });
function handleCloseEvents(mainWindow: BrowserWindow) {
    let willClose = false;
    mainWindow.on('close', () => {
        if (willClose) {
            return;
        }
        // Allow the default close behavior (quitting the app)
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
    globalShortcut.register('`', () => {
        if (mainWindow) {
            mainWindow.webContents.toggleDevTools();
        }
    });
    globalShortcut.register('CommandOrControl+Shift+S', async () => {
        mainWindow.webContents.send('log-message', 'in summarize shortcut');
        const result = await takeChromeScreenshot();
        mainWindow.webContents.send('log-message', 'screenshot captured');
        console.log("in summarize shortcut");   
        if (result && mainWindow) {
            const apiKey = store.get('apiKey') as string;
            const response = await aiImageCall(result.base64, apiKey);
            mainWindow.webContents.send('log-message', `ai image call completed, ${response?.output_text}`);
            console.log(response?.output_text);
            if (response?.output_text) {
                summary = await apiCall(response.output_text, "summarize", apiKey);
                mainWindow.webContents.send('log-message', `summarization call complete, ${summary?.output_text}`);

            }
            if (summary) {
                mainWindow.show();
                mainWindow.focus();
                mainWindow.webContents.send('screenshot-taken-summary', summary.output_text);
            }
        }
    });
    globalShortcut.register('CommandOrControl+Shift+C', async () => {
        mainWindow.webContents.send('log-message', 'in fact-check shortcut');
        const result = await takeChromeScreenshot();
        mainWindow.webContents.send('log-message', 'screenshot captured');
        console.log("in fact-check shortcut");
        if (result && mainWindow) {
            const apiKey = store.get('apiKey') as string;
            const response = await aiImageCall(result.base64, apiKey);
            mainWindow.webContents.send('log-message', 'ai image call completed');
            console.log(response?.output_text);
            if (response?.output_text) {
                factcheck = await apiCall(response.output_text, "fact-check", apiKey);
                mainWindow.webContents.send('log-message', 'summarization call complete');
            }
            if (factcheck) {
                mainWindow.show();
                mainWindow.focus();
                mainWindow.webContents.send('screenshot-taken-fact-check', factcheck.output_text);
            }
        }
    });
    if (isDev()) {
        globalShortcut.register('`', () => {
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
        
        
        return {
            success: true,
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
async function apiCall(link: string, calltype: string, apiKey?: string): Promise<{ output_text: string } | undefined> {
    try {
        const response = await aiCall(link, calltype, apiKey);
        console.log("AI Call Response:", response);
        return response;
    } catch (error) {
        console.error("Error during AI call:", error);
    }
}

async function aiImageCall(imageBase64: string, apiKey?: string): Promise<{ output_text: string } | undefined> {
    console.log("Received image for processing.");
    try {
        const response = await apiImageCall(imageBase64, apiKey);
        console.log("API Image Call Response:", response);
        return response;
    } catch (error) {
        console.error("Error during API image call:", error);   
    }
}