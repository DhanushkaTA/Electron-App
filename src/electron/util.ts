import { ipcMain, WebContents, WebFrameMain } from "electron"
import { getUiPath } from "./pathResolver.js"
import { pathToFileURL } from 'url';

export function isDev(): boolean {
    return process.env.NODE_ENV === 'development'
}

export const ipcMainHandle = <Key extends keyof EventPayloadMapping>(
    key:Key,
    handler: () => EventPayloadMapping[Key]
) => {
    ipcMain.handle(key, (event) => {
        validateEventFrame(event.senderFrame);
        return handler()
    })
}

export const ipcWebContentsSend = <Key extends keyof EventPayloadMapping>(
    key:Key,
    webContents: WebContents,
    payload: EventPayloadMapping[Key]
) => {
    webContents.send(key,payload)
}

export function validateEventFrame(frame: WebFrameMain | null) {

    console.log(frame?.url);
    

    if(frame){
        if (isDev() && new URL(frame.url).host === 'localhost:5125') {
            return;
        }

        if (frame.url !== pathToFileURL(getUiPath()).toString()) {
            throw new Error('Malicious event');
        }
    }
  }