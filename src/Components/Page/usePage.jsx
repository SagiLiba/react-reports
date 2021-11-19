import React, { useCallback, useEffect, useContext, useState } from 'react';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { ReportContext } from './../../Contexts/ReportContext';

export const usePage = ({
  automaticPageNumber = true,
  name = '',
  repeating = null,
  showHeader = true,
  showFooter = true,
  customFooter = null,
  customHeader = null,
  showRepeatingTopComponent = false,
  showRepeatingBottomComponent = false,
}) => {
  const reportContext = useContext(ReportContext);
  const [pageNumber, setPageNumber] = useState('');
  const config = { ...reportContext.config };

  // PageGroup overrides:
  if (customHeader) {
    config['header'] = customHeader;
  }

  if (customFooter) {
    config['footer'] = customFooter;
  }

  useEffect(() => {
    if (automaticPageNumber && reportContext.readyForAddingPageNumbers) {
      const getPageNumber = reportContext.getPageId();
      setPageNumber(getPageNumber);
      reportContext.updatePageNumber(getPageNumber);
    }
  }, [reportContext.readyForAddingPageNumbers]);

  const renderHeader = useCallback(() => {
    const HeaderComponent = config && config.header && config.header.component;
    const headerHeight = config && config.header && config.header.height;

    if (headerHeight && HeaderComponent) {
      return <HeaderComponent pageName={name} pageNumber={pageNumber} />;
    }

    return <Header pageName={name} pageNumber={pageNumber} />;
  }, [showHeader, name, pageNumber]);

  const renderFooter = useCallback(() => {
    const FooterComponent = config && config.footer && config.footer.component;
    const footerHeight = config && config.footer && config.footer.height;

    if (footerHeight && FooterComponent) {
      return <FooterComponent pageName={name} pageNumber={pageNumber} />;
    }

    return <Footer pageName={name} pageNumber={pageNumber} />;
  }, [showFooter, name, pageNumber]);

  const renderRepeatingComponent = useCallback(
    (property) => {
      const propertyObj = repeating && repeating[property];
      const Component = propertyObj && propertyObj.component;
      const height = propertyObj && propertyObj.height;

      if (Component && height) {
        return <Component pageName={name} pageNumber={pageNumber} />;
      }

      return null;
    },
    [
      repeating,
      showRepeatingTopComponent,
      showRepeatingBottomComponent,
      name,
      pageNumber,
    ]
  );

  return { renderHeader, renderFooter, renderRepeatingComponent, pageNumber };
};
