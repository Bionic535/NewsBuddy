const { contextBridge, ipcRenderer, desktopCapturer } = require('electron');

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
    ...args: any[]
): Promise<EventPayloadMapping[Key]> {
    return ipcRenderer.invoke(key, ...args);
}

contextBridge.exposeInMainWorld('electronAPI', {
  aiCall: (link: string, calltype: string) => ipcRenderer.invoke('aiCall', link, calltype)
});