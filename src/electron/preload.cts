const electron = require('electron')

electron.contextBridge.exposeInMainWorld("electron", {
    ai_call: () => ipcInvoke('ai_call'),
} satisfies Window['electron'])

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key);
}
