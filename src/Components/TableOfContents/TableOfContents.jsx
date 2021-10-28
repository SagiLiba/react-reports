import React, { useContext } from 'react';
import { ReportContext } from '../../Contexts/ReportContext';
import { Page } from './../Page/Page';

// TODO: make sure ready-for-print is displayed after table of contents is ready
// Separate ready-for-print into multiple part, one for all components ready, one for table of contents, then combine
export const TableOfContents = (page) => {
  const reportContext = useContext(ReportContext);
  const pagesInfo = reportContext.pagesInfo;

  const renderTable = () => {
    let elements = [];
    let pagesNumbering = 1;

    for (let [key, value] of Object.entries(pagesInfo)) {
      const pagesAmount = value.pagesAmount;
      const pageName = value && value.data && value.data.name;
      const fromPage = pagesNumbering;
      const toPage = pagesNumbering + pagesAmount - 1;
      const pageRange = pagesAmount === 1 ? `${fromPage}` : `${fromPage} - ${toPage}`;

      // Continue to next pages numbers
      pagesNumbering += pagesAmount;

      elements.push(
        <div key={key}>
          <a href={`#page-${pagesNumbering - pagesAmount}`}>
            {pageName} - {pageRange}
          </a>
        </div>
      );
    }

    return elements;
  };

  return (
    <Page pageId={'rr-table-of-contents'} automaticPageNumber={false} showHeader={false} showFooter={false}>
      {reportContext.readyForPrint && renderTable()}
    </Page>
  );
};
