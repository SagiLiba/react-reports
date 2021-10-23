import { createContext, useContext, useState } from 'react';

export const ReportContext = createContext({});

export const ReportContextProvider = ({ children }) => {
  const [pagesCounter, setPagesCounter] = useState(0);
  const [pagesAreReady, setPagesAreReady] = useState({});
  const [readyForPrint, setReadyForPrint] = useState(false);

  const providedValue = {};

  return (
    <ReportContext.Provider value={providedValue}>
      {children}
      {readyForPrint && <div id={'ready-for-print'} />}
    </ReportContext.Provider>
  );
};
