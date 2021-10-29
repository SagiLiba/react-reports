import React, { createContext, useState, useEffect } from 'react';

export const PageGroupContext = createContext({});

export const PageGroupProvider = ({ children }) => {
  const [savedChildrenStates, setSavedChildrenState] = useState({});

  const saveChildState = (index) => (state) => {
    setSavedChildrenState((current) => ({ ...current, [index]: state }));
  };

  const publicMethods = {
    saveChildState,
    savedChildrenStates,
  };

  return <PageGroupContext.Provider value={publicMethods}>{children}</PageGroupContext.Provider>;
};
