import React, { useContext, useEffect, useState } from 'react';
import { ReportContext } from '../../Contexts/ReportContext';
import './Page.scss';

export const Page = ({ children }) => {
  const reportContext = useContext(ReportContext);
  const [pageNumber, setPageNumber] = useState('');

  useEffect(() => {
    setPageNumber(reportContext.getPageId());
  }, []);

  return <div className={`page page-${pageNumber}`}>{children}</div>;
};
