const electron = require('electron')

electron.contextBridge.exposeInMainWorld("electron", {
    ai_call: (functype: string, link: string) => ipcInvoke('ai_call', functype, link),
} satisfies Window['electron'])

function ipcInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
    ...args: any[]
): Promise<EventPayloadMapping[Key]> {
    return electron.ipcRenderer.invoke(key, ...args);
}
