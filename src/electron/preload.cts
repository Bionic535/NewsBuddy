import { IpcRendererEvent } from "electron";

const { contextBridge, ipcRenderer} = require('electron');

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
    ...args: any[]
): Promise<EventPayloadMapping[Key]> {
    return ipcRenderer.invoke(key, ...args);
}

contextBridge.exposeInMainWorld('electronAPI', {
  aiCall: (link: string, calltype: string) => ipcRenderer.invoke('aiCall', link, calltype)
  , apiImageCall: (imageBase64: string) => ipcRenderer.invoke('apiImageCall', imageBase64)
  , onScreenshotTaken: (callback: (value: any) => void) => {
      const listener = (_event: IpcRendererEvent, value: any) => callback(value);
      ipcRenderer.on('screenshot-taken', listener);
      return () => {
        ipcRenderer.removeListener('screenshot-taken', listener);
      };
    }
});