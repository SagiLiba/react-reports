import { createContext, useEffect, useRef, useState } from 'react';
import './ReportStyles.scss';
import { useReportContextHelper } from './useReportContextHelper';
import { useReportDataHandler } from './useReportDataHandler';

export const ReportContext = createContext({});

export const ReportProvider = ({ config, children }) => {
  const pageCounter = useRef(0);
  const { handledInitialValues, handledAPIRequests, data } = useReportDataHandler({ config });
  const { readyForPrint, readyForAddingPageNumbers, pagesInfo, updatePageGroup, registerPageGroup, updatePageNumber } =
    useReportContextHelper();

  const getPageId = () => {
    pageCounter.current += 1;
    return pageCounter.current;
  };

  const publicOptions = {
    config,
    registerPageGroup,
    updatePageGroup,
    getPageId,
    pagesInfo,
    readyForPrint,
    readyForAddingPageNumbers,
    updatePageNumber,
    data,
  };

  // -----------------------------------------------------
  // Do not render until all the API requests are handled.
  // -----------------------------------------------------
  if (!handledAPIRequests) {
    return <></>;
  }
  // -------------------------------------------------------
  // Do not render until all the initial values are handled.
  // -------------------------------------------------------
  if (!handledInitialValues) {
    return <></>;
  }

  // -------------------------------------------------------------------------
  // Start rendering the report, only after APIs & initialValues were handled.
  // -------------------------------------------------------------------------
  const fadeInClass = readyForPrint ? 'rr-report-ready' : '';

  return (
    <ReportContext.Provider value={publicOptions}>
      {!readyForPrint && <div className='rr-loader'>Generating Report</div>}
      <section className={`rr-report ${fadeInClass}`}>
        {children}
        {readyForPrint && <div id={'rr-ready-for-print'} />}
      </section>
    </ReportContext.Provider>
  );
};
