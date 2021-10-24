import React, { useContext, useEffect, useState } from 'react';
import { ReportContext } from '../../Contexts/ReportContext';
import './Page.scss';

export const Page = ({ children, pageId, automaticPageNumber = true }) => {
  const reportContext = useContext(ReportContext);
  const [pageNumber, setPageNumber] = useState('');

  useEffect(() => {
    if (automaticPageNumber) {
      setPageNumber(reportContext.getPageId());
    }
  }, []);

  const pageElementId = pageId ? pageId : 'page-' + pageNumber;

  return (
    <article className={`page`} id={pageElementId}>
      {children}
    </article>
  );
};
