import { createContext, useContext, useEffect, useState } from 'react';

export const ReportContext = createContext({});

let counter = 0;
let pageCounter = 0;

export const ReportContextProvider = ({ children }) => {
  const [pagesInfo, setPagesInfo] = useState({});
  const [readyForPrint, setReadyForPrint] = useState(false);

  const registerPageSplit = () => {
    counter = counter + 1;
    setPagesInfo((current) => ({ ...current, [counter - 1]: { ready: false, pagesAmount: 0 } }));
    return counter - 1;
  };

  const updatePageSplit = ({ id, ready, pagesAmount }) => {
    setPagesInfo((current) => ({ ...current, [id]: { ready, pagesAmount } }));
  };

  const getPageId = () => {
    pageCounter += 1;
    return pageCounter;
  };

  useEffect(() => {
    const isPagesReady = Object.values(pagesInfo).every((value) => value.ready);
    const allPageSplitComponentsRegistered = counter === Object.keys(pagesInfo).length;

    if (allPageSplitComponentsRegistered && isPagesReady) {
      console.log(pagesInfo);
      setReadyForPrint(true);
    } else {
      // console.log(pagesInfo);
    }
  }, [pagesInfo]);

  const providedValue = {
    registerPageSplit,
    updatePageSplit,
    getPageId,
  };

  return (
    <ReportContext.Provider value={providedValue}>
      {children}
      {readyForPrint && <div id={'ready-for-print'} />}
    </ReportContext.Provider>
  );
};
