import { ipcMain, type WebContents, type WebFrameMain } from "electron";
import { pathToFileURL } from "url";
import { getUiPath } from "./pathResolver.js";


export function isDev(): boolean {
    return process.env.NODE_ENV === 'development';
}

export function ipcMainHandle<Key extends keyof EventPayloadMapping>(
    key: Key, 
    handler: (functype: string, link: string) => Promise<EventPayloadMapping[Key]> | EventPayloadMapping[Key]
) {
    ipcMain.handle(key, (event, functype: string, link: string) => {
        if (!event.senderFrame) {
            throw new Error("senderFrame is null");
        }
        validateEventFrame(event.senderFrame);
        return handler(functype, link);
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
    if (isDev() && new URL(frame.url).hostname !== 'localhost:5125') {
        return;
    }
    if (frame.url !== pathToFileURL(getUiPath()).toString()) {
        throw new Error(`Invalid frame URL`);
    }
}