import { ipcMain, type WebContents, type WebFrameMain } from "electron";
import { pathToFileURL } from "url";
import { getUiPath } from "./pathResolver.js";


export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
    key: Key, 
    handler: (...args: any[]) => Promise<EventPayloadMapping[Key]> | EventPayloadMapping[Key]
) {
    ipcMain.handle(key, (event, ...args) => {
        if (!event.senderFrame) {
            throw new Error("senderFrame is null");
        }
        validateEventFrame(event.senderFrame);
        return handler(...args);
    });
}

export function ipcWebContentsSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]
) {
    webContents.send(key, payload);
}

export function validateEventFrame(frame: WebFrameMain) {
    console.log(`Validating frame URL: ${frame.url}`);
    if (isDev()) {
        if (new URL(frame.url).host === 'localhost:5123') {
            return;
        }
    } else {
        if (frame.url === pathToFileURL(getUiPath()).toString()) {
            return;
        }
    }
    throw new Error(`Invalid frame URL: ${frame.url}`);
}