import {app, BrowserWindow} from "electron"
import path from 'path'
import { isDev } from "./util.js";
import { pollResource } from "./resourceManager.js";

type test = string;

app.on('ready', () => {
    const mainWindow = new BrowserWindow({});
    if(isDev()){
        mainWindow.loadURL('http://localhost:5123/')
    }else{
        // app.getAppPath() -> get app current path
        mainWindow.loadFile(path.join(app.getAppPath() + '/dist-react/index.html'));
    }

    pollResource();

})