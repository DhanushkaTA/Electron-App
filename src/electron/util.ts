import { ipcMain, WebContents } from "electron"

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development'
}

export const ipcMainHandle = <Key extends keyof EventPayloadMapping>(
    key:Key,
    handler: () => EventPayloadMapping[Key]
) => {
    ipcMain.handle(key, () => handler())
}

export const ipcWebContentsSend = <Key extends keyof EventPayloadMapping>(
    key:Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]
) => {
    webContents.send(key,payload)
}