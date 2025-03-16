import { useEffect, useMemo, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { useStatistics } from './useStatistics'
import { Chart } from './Chart'
// import { BaseChart } from './BaseChart'

function App() {
  const staticData = useStaticData();
  const statistics = useStatistics(10);
  const [activeView, setActiveView] = useState<View>('CPU');

  const cpuUsage = useMemo(
    () => statistics.map(stat => stat.cpuUsage),
    [statistics]
  );
  const ramUsage = useMemo(
    () => statistics.map(stat => stat.ramUsage),
    [statistics]
  );
  const storageUsage = useMemo(
    () => statistics.map(stat => stat.storageData),
    [statistics]
  );
  
  const activeUsages = useMemo(() => {
    switch (activeView) {
      case 'CPU':
        return cpuUsage;
      case 'RAM':
        return ramUsage;
      case 'STORAGE':
        return storageUsage;
    }
  }, [activeView, cpuUsage, ramUsage, storageUsage]);

  console.log(statistics);

  //action bar
  useEffect(() => {
    return window.electron.subscribeChangeView((view) => setActiveView(view));
  }, []);
  

  return (
    <>
      <div className='App'>

        <Header/>

        <div className='main'>
          <div>
          <SelectOption
            onClick={() => setActiveView('CPU')}
            title="CPU"
            view="CPU"
            subTitle={staticData?.cpuModel ?? ''}
            data={cpuUsage}
          />
          <SelectOption
            onClick={() => setActiveView('RAM')}
            title="RAM"
            view="RAM"
            subTitle={(staticData?.totalMemoryGB.toString() ?? '') + ' GB'}
            data={ramUsage}
          />
          <SelectOption
            onClick={() => setActiveView('STORAGE')}
            title="STORAGE"
            view="STORAGE"
            subTitle={(staticData?.totalStorage.toString() ?? '') + ' GB'}
            data={storageUsage}
          />
          </div>

          <div className='mainGrid'>
            <Chart data={activeUsages} maxDataPoints={10} selectedView={activeView}/>
          </div>
        </div>

        
      </div>
     
      {/* 🎀🍂🍃 */}
    </>
  )
}

function SelectOption(props: {
  title: string;
  view: View;
  subTitle: string;
  data: number[];
  onClick: () => void;
}) {
  return (
    <button className="selectOption" onClick={props.onClick}>
      <div className="selectOptionTitle">
        <div>{props.title}</div>
        <div>{props.subTitle}</div>
      </div>
      <div className="selectOptionChart">
        <Chart selectedView={props.view} data={props.data} maxDataPoints={10} />
      </div>
    </button>
  );
}

function Header() {
  return (
    <header>
      <button
        id="close"
        onClick={() => window.electron.sendFrameAction('CLOSE')}
      />
      <button
        id="minimize"
        onClick={() => window.electron.sendFrameAction('MINIMIZE')}
      />
      <button
        id="maximize"
        onClick={() => window.electron.sendFrameAction('MAXIMIZE')}
      />
    </header>
  );
}

function useStaticData() {
  const [staticData, setStaticData] = useState<StaticData | null>(null);

  useEffect(() => {
    (async () => {
      setStaticData(await window.electron.getStaticData());
    })();
  }, []);

  return staticData;
}


export default App