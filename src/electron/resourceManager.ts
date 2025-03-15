import osUtils from 'os-utils'
import fs from 'fs'

const POLLING_INTERVAL = 500;

export const pollResource = () => {
    setInterval(async () => {
        const cpuUsage = await getCpuUsage() 
        const ramUsage = getRamUsage();
        const storageData = getStorageData();

        console.log({cpuUsage , ramUsage, storageData: storageData.usage});

    }, POLLING_INTERVAL)
}

export const getCpuUsage  = () => {
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