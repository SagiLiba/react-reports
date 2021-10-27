import { createContext } from 'react';

export const PageGroupContext = createContext({});

export const PageGroupProvider = ({ children }) => {
  return <PageGroupContext.Provider value={{}}>{children}</PageGroupContext.Provider>;
};
