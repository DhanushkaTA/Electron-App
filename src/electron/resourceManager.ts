import osUtils from 'os-utils'
import fs from 'fs'
import os from 'os'
import { BrowserWindow } from 'electron';
import { ipcWebContentsSend } from './util.js';

const POLLING_INTERVAL = 500;

export const pollResource = (mainWindow: BrowserWindow) => {
    setInterval(async () => {
        const cpuUsage = await getCpuUsage() 
        const ramUsage = getRamUsage();
        const storageData = getStorageData();

        //send data to ui
        ipcWebContentsSend("statistics", mainWindow.webContents, {
            cpuUsage ,
            ramUsage, 
            storageData: storageData.usage
        })

        // console.log({cpuUsage , ramUsage, storageData: storageData.usage});

    }, POLLING_INTERVAL)
}

export const getStaticData = () => {
    const totalStorage = getStorageData().total;
    const cpuModel = os.cpus()[0].model;
    const totalMemoryGB = Math.floor(osUtils.totalmem() / 1024)

    return {
        totalStorage,
        cpuModel,
        totalMemoryGB 
    }
}

export const getCpuUsage  = ():Promise<number> => {
    return new Promise(resolve => {
        osUtils.cpuUsage(resolve)
    }) 
    // osUtils.cpuUsage((percentage) => console.log(percentage))
}

export const getRamUsage  = () => {
    return 1 - osUtils.freememPercentage();
}

const getStorageData = () => {
    const stats = fs.statfsSync(process.platform === 'win32' ? 'C://' : '/');
    const total = stats.bsize * stats.blocks;
    const free = stats.bsize * stats.bfree;

    return {
        total: Math.floor(total / 1_000_000_000),
        usage: 1 - free / total
    };
}