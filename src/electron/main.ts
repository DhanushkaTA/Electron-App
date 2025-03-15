import {app, BrowserWindow, ipcMain} from "electron"
import path from 'path'
import { ipcMainHandle, isDev } from "./util.js";
import { getStaticData, pollResource } from "./resourceManager.js";
import { getPreloadPath } from "./pathResolver.js";

type test = string;

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        webPreferences:{
            preload: getPreloadPath(), 
        }
    });
    if(isDev()){
        mainWindow.loadURL('http://localhost:5123/')
    }else{
        // app.getAppPath() -> get app current path
        mainWindow.loadFile(path.join(app.getAppPath() + '/dist-react/index.html'));
    }

    pollResource(mainWindow);

    ipcMainHandle("getStaticData", () => {
        return getStaticData()
    })

})