import {app, BrowserWindow, ipcMain, Tray} from "electron"
import path from 'path'
import { ipcMainHandle, isDev } from "./util.js";
import { getStaticData, pollResource } from "./resourceManager.js";
import { getAssetPath, getPreloadPath, getUiPath } from "./pathResolver.js";

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
        mainWindow.loadFile(getUiPath());
    }

    pollResource(mainWindow);

    ipcMainHandle("getStaticData", () => {
        return getStaticData()
    })

    new Tray(path.join(getAssetPath(), "trayIcon.png"))

   handleCloseEvents(mainWindow);

})

function handleCloseEvents(mainWindow: BrowserWindow){
    let willClose = false;

    mainWindow.on('close', (e)=> {
        if(willClose){
            return;
        }
        e.preventDefault();
        mainWindow.hide();
        //for apple
        if(app.dock){
            app.dock.hide();
        }
    });

    app.on('before-quit',() => {
        willClose = true;
    })

    mainWindow.on('show',() => {
        willClose = false;
    })
}
