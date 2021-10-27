import React, { useContext } from 'react';
import { ReportContext } from './../Contexts/ReportContext';

export const useReport = () => {
  const reportContext = useContext(ReportContext);

  return { ...reportContext.data };
};
