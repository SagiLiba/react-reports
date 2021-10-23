import { createContext, useContext, useState } from 'react';

export const ReportContext = createContext({});

export const ReportContextProvider = ({ children }) => {
  const [state, setState] = useState({});

  return <ReportContext.Provider value={state}>{children}</ReportContext.Provider>;
};
