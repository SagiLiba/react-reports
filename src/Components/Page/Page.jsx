import React, { useContext, useEffect, useState } from 'react';
import { ReportContext } from '../../Contexts/ReportContext';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import './Page.scss';

export const Page = ({
  children,
  pageId,
  automaticPageNumber = true,
  name = '',
  showHeader = true,
  showFooter = true,
}) => {
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
      {showHeader && <Header pageName={name} />}
      {children}
      {/* Remove this line number, it is not part of the page calculation */}
      {showFooter && <Footer pageName={''} pageNumber={pageNumber} />}
    </article>
  );
};
