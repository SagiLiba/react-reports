import React, { useContext, useEffect, useState } from 'react';
import { ReportContext } from '../../Contexts/ReportContext';
import './Page.scss';

export const Page = ({ children, pageId, automaticPageNumber = true }) => {
  const reportContext = useContext(ReportContext);
  const [pageNumber, setPageNumber] = useState('');

  useEffect(() => {
    if (automaticPageNumber && reportContext.readyForAddingPageNumbers) {
      const getPageNumber = reportContext.getPageId();
      setPageNumber(getPageNumber);
      reportContext.updatePageNumber(getPageNumber);
    }
  }, [reportContext.readyForAddingPageNumbers]);

  const pageElementId = pageId ? pageId : 'page-' + pageNumber;

  return (
    <article className={`page`} id={pageElementId}>
      {children}
      {/* Remove this line number, it is not part of the page calculation */}
      <center>{pageNumber}</center>
    </article>
  );
};
