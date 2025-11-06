import { ipcMain, type WebContents, type WebFrameMain } from "electron";


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
    const url = (frame && (frame.url || (frame as any).url)) ?? '';
    if (isDev()) {
        // accept dev server (common Vite ports)
        if (url.startsWith('http://localhost:5123') || url.startsWith('http://localhost:5173')) {
            return;
        }
    } else {
        // packaged app: accept any file:// URL that points to your built UI index
        // this covers paths like file:///C:/.../resources/app.asar/dist-react/index.html[#...]
        if (url.startsWith('file://') && url.includes('/dist-react/index.html')) {
            return;
        }
    }
    throw new Error(`Invalid frame URL: ${url}`);
}