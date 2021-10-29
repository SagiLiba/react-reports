import React, { useEffect, useRef, useState } from 'react';
import { isEmptyObject } from '../Components/ReportsLib';

export const useReportContextHelper = () => {
  const pageGroupComponentsAmount = useRef(0);
  const [readyForPrint, setReadyForPrint] = useState(false);
  const [readyForAddingPageNumbers, setReadyForAddingPageNumbers] = useState(false);
  const [addedPageNumbers, setAddedPageNumbers] = useState(false);
  const [pagesInfo, setPagesInfo] = useState({});

  // --------------------------------------------
  // Tracking each PageGroup component creation,
  // settings its initial values to the defaults.
  // --------------------------------------------
  const registerPageGroup = () => {
    pageGroupComponentsAmount.current = pageGroupComponentsAmount.current + 1;
    setPagesInfo((current) => ({
      ...current,
      [pageGroupComponentsAmount.current - 1]: { ready: false, pagesAmount: 0, data: {} },
    }));
    return pageGroupComponentsAmount.current - 1;
  };

  // --------------------------------------------------------
  // Update "pagesInfo" when the PageGroup component is ready
  // and has split its component to different pages.
  // Addtional group info can be added here.
  // --------------------------------------------------------
  const updatePageGroup = ({ id, ready, pagesAmount, data }) => {
    setPagesInfo((current) => ({ ...current, [id]: { ready, pagesAmount, data } }));
  };
  // ---------------------------------------
  // Notify when all page numbers were added
  // ---------------------------------------
  const updatePageNumber = (pageNumber) => {
    const amountOfPages = Object.values(pagesInfo).reduce((sum, { pagesAmount }) => sum + pagesAmount, 0);
    if (pageNumber === amountOfPages) {
      setAddedPageNumbers(true);
    }
  };

  // -----------------------------------------------------------
  // Decide when to render the "ready-for-print" element,
  // Allowing automated tools to print the page to a PDF format.
  // -----------------------------------------------------------
  const handleReadyForPrint = () => {
    console.log('Ready for print', pagesInfo);
    setReadyForPrint(true);
  };

  // ---------------------------------------------------
  // When all pages are ready, start adding page numbers
  // ---------------------------------------------------
  const handleAddPageNumbers = () => {
    let isPagesReady = false;

    if (!isEmptyObject(pagesInfo)) {
      isPagesReady = Object.values(pagesInfo).every((value) => value.ready);
    }

    const allPageGroupComponentsRegistered = pageGroupComponentsAmount.current === Object.keys(pagesInfo).length;

    if (allPageGroupComponentsRegistered && isPagesReady) {
      setReadyForAddingPageNumbers(true);
    }
  };

  useEffect(() => {
    handleAddPageNumbers();
  }, [pagesInfo]);

  useEffect(() => {
    if (addedPageNumbers) {
      handleReadyForPrint(true);
    }
  }, [addedPageNumbers]);

  return { readyForPrint, readyForAddingPageNumbers, updatePageNumber, registerPageGroup, updatePageGroup, pagesInfo };
};
