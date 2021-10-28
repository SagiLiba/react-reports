import React, { useCallback, useContext, useEffect, useState } from 'react';
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
  const config = reportContext.config;
  const [pageNumber, setPageNumber] = useState('');

  useEffect(() => {
    if (automaticPageNumber && reportContext.readyForAddingPageNumbers) {
      const getPageNumber = reportContext.getPageId();
      setPageNumber(getPageNumber);
      reportContext.updatePageNumber(getPageNumber);
    }
  }, [reportContext.readyForAddingPageNumbers]);

  const pageElementId = pageId ? pageId : 'page-' + pageNumber;

  const renderHeader = useCallback(() => {
    const HeaderComponent = config && config.header && config.header.component;
    const headerHeight = config && config.header && config.header.height;

    if (headerHeight && HeaderComponent) {
      return <HeaderComponent pageName={name} pageNumber={pageNumber} />;
    }

    return <Header pageName={name} pageNumber={pageNumber} />;
  }, [showHeader, pageNumber]);

  const renderFooter = useCallback(() => {
    const FooterComponent = config && config.footer && config.footer.component;
    const footerHeight = config && config.footer && config.footer.height;

    if (footerHeight && FooterComponent) {
      return <FooterComponent pageName={name} pageNumber={pageNumber} />;
    }

    return <Footer pageName={name} pageNumber={pageNumber} />;
  }, [showFooter, pageNumber]);

  return (
    <article className={`page`} id={pageElementId}>
      {showHeader && renderHeader()}
      {children}
      {/* Remove this line number, it is not part of the page calculation */}
      {showFooter && renderFooter()}
    </article>
  );
};
