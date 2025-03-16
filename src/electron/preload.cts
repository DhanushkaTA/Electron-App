// import { getStaticData } from "./resourceManager"

const electron = require('electron')

electron.contextBridge.exposeInMainWorld("electron", {
    subscribeStatistics: (callback) => {
        return ipcOn('statistics', (stats) => {
            callback(stats)
        })
    },
    getStaticData: () => icpInvoke('getStaticData'),
    subscribeChangeView: (callback) => {
        return ipcOn('changeView', (stats) => {
            callback(stats)
        })
    },
    sendFrameAction: (payload) => ipcSend('sendFrameAction',payload)
    
} satisfies Window['electron']);

//like basic req
function icpInvoke<Key extends keyof EventPayloadMapping>(
    key: Key,
):(Promise<EventPayloadMapping[Key]>) {
    return electron.ipcRenderer.invoke(key)
}

function ipcOn<Key extends keyof EventPayloadMapping>(
    key: Key,
    callback: (payload: EventPayloadMapping[Key]) => void
) {
    const cb = (_: Electron.IpcRendererEvent, payload: any) => callback(payload)
    electron.ipcRenderer.on(key, cb)
    return () => electron.ipcRenderer.off(key, cb)
}

function ipcSend<Key extends keyof EventPayloadMapping>(
    key: Key,
    payload: EventPayloadMapping[Key]
) {
    electron.ipcRenderer.send(key, payload)
}