import { createContext, useContext, useEffect, useState } from 'react';

export const ReportContext = createContext({});
let pagesSplitComponentsAmount = 0;
let counter = 0;
let pageCounter = 0;

export const ReportContextProvider = ({ children }) => {
  const [pagesInfo, setPagesInfo] = useState({});
  const [readyForPrint, setReadyForPrint] = useState(false);

  const registerPageSplit = () => {
    pagesSplitComponentsAmount = pagesSplitComponentsAmount + 1;
    setPagesInfo((current) => ({
      ...current,
      [pagesSplitComponentsAmount - 1]: { ready: false, pagesAmount: 0, data: {} },
    }));
    return pagesSplitComponentsAmount - 1;
  };

  const updatePageSplit = ({ id, ready, pagesAmount, data }) => {
    setPagesInfo((current) => ({ ...current, [id]: { ready, pagesAmount, data } }));
  };

  const getPageId = () => {
    pageCounter += 1;
    return pageCounter;
  };

  useEffect(() => {
    const isPagesReady = Object.values(pagesInfo).every((value) => value.ready);
    const allPageSplitComponentsRegistered = pagesSplitComponentsAmount === Object.keys(pagesInfo).length;

    if (allPageSplitComponentsRegistered && isPagesReady) {
      console.log('Ready for print', pagesInfo);
      setReadyForPrint(true);
    }
  }, [pagesInfo]);

  const providedValue = {
    registerPageSplit,
    updatePageSplit,
    getPageId,
    pagesInfo,
    readyForPrint,
  };

  return (
    <ReportContext.Provider value={providedValue}>
      {children}
      {readyForPrint && <div id={'ready-for-print'} />}
    </ReportContext.Provider>
  );
};
