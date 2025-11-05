import type { IpcRendererEvent } from "electron";
const { contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  aiCall: (link: string, calltype: string) => ipcRenderer.invoke('aiCall', link, calltype)
  , apiImageCall: (imageBase64: string) => ipcRenderer.invoke('apiImageCall', imageBase64)
  , onScreenshotTakenSummary: (callback: (value: any) => void) => {
      const listener = (_event: IpcRendererEvent, value: any) => callback(value);
      ipcRenderer.on('screenshot-taken-summary', listener);
      return () => {
        ipcRenderer.removeListener('screenshot-taken-summary', listener);
      };
    }
  , onScreenshotTakenFactCheck: (callback: (value: any) => void) => {
      const listener = (_event: IpcRendererEvent, value: any) => callback(value);
      ipcRenderer.on('screenshot-taken-fact-check', listener);
      return () => {
        ipcRenderer.removeListener('screenshot-taken-fact-check', listener);
      };
    }
});