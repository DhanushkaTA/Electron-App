import {app, BrowserWindow, ipcMain, Menu, Tray} from "electron"
import path from 'path'
import { ipcMainHandle, ipcMainOn, isDev } from "./util.js";
import { getStaticData, pollResource } from "./resourceManager.js";
import { getAssetPath, getPreloadPath, getUiPath } from "./pathResolver.js";
import { createTray } from "./tray.js";
import { createMenu } from "./menu.js";

// Menu.setApplicationMenu(null)

app.on('ready', () => {
    const mainWindow = new BrowserWindow({
        webPreferences:{
            preload: getPreloadPath(), 
        },
        frame: false
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

    ipcMainOn('sendFrameAction', (payload) => {
        switch (payload) {
          case 'CLOSE':
            mainWindow.close();
            break;
          case 'MAXIMIZE':
            mainWindow.maximize();
            break;
          case 'MINIMIZE':
            mainWindow.minimize();
            break;
        }
      });
    

    createTray(mainWindow)
    createMenu(mainWindow)
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
