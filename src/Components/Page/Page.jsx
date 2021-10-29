import React from 'react';
import { usePage } from './usePage';

export const Page = ({
  children,
  pageId,
  automaticPageNumber = true,
  name = '',
  showHeader = true,
  showFooter = true,
  repeating = null,
  showRepeatingTopComponent = false,
  showRepeatingBottomComponent = false,
}) => {
  const { renderHeader, renderFooter, renderRepeatingComponent, pageNumber } = usePage({
    automaticPageNumber,
    repeating,
    name,
    showHeader,
    showFooter,
    showRepeatingTopComponent,
    showRepeatingBottomComponent,
  });

  const pageElementId = pageId ? pageId : 'page-' + pageNumber;

  return (
    <article className={`rr-page`} id={pageElementId}>
      {showHeader && renderHeader()}
      {showRepeatingTopComponent && renderRepeatingComponent('top')}
      {children}
      {showRepeatingBottomComponent && renderRepeatingComponent('bottom')}
      {showFooter && renderFooter()}
    </article>
  );
};
