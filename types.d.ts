type Statistics = {
    cpuUsage:number,
    ramUsage:number, 
    storageData:number
};

type StaticData = {
    totalStorage:number,
    cpuModel:string,
    totalMemoryGB:number
}

type EventPayloadMapping = {
    statistics: Statistics;
    getStaticData: StaticData;
    changeView: View;
}

type View = "CPU" | "RAM" | "STORAGE";

type UnsubscribeFunction = () => void;

interface Window {
    electron: {
        subscribeStatistics: (callback: (statistics: Statistics) => void) => UnsubscribeFunction;
        getStaticData: () => Promise<StaticData>;
        subscribeChangeView: (callback: (view: View) => void) => UnsubscribeFunction;
    }
}