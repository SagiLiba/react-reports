import { Header, DefaultHeaderHeight } from './Header/Header';
import { Footer, DefaultFooterHeight } from './Footer/Footer';

export const RenderPhase = {
  MEASURE: 'MEASURE',
  SPLIT_TO_PAGES: 'SPLIT_TO_PAGES',
  PAGES_READY: 'PAGES_READY',
};

export const PageSize = {
  A4: {
    width: 793,
    height: 1120,
  },
};

/*

  Default header, user has not set a header
  Default footer, user has not set a footer

  - Get their size and component
  - push them into each new page
  - make sure to adjust height calculations.

  No footer
  - adjust height calculation

  No header
  - adjust height calculation

  No header & No Footer

  User set custom Header
  - Get its component
  - Get Its height
  - adjust calculations

  User set custom Footer
  - Get its component
  - Get Its height
  - adjust calculations

*/

// TODO: need to account for header & footer display prop
const fillPage = ({ children, childrenHeights, header, headerHeight, footer, footerHeight }) => {
  let page = [];
  let sumChildrenHeights = 0;
  let pageHeight = PageSize.A4.height;
  const hasHeader = header && headerHeight;
  const hasFooter = footer && footerHeight;

  // Account for header height
  if (hasHeader) {
    pageHeight -= headerHeight;
  }
  // Account for footer height
  if (hasFooter) {
    pageHeight -= footerHeight;
  }

  // Add children to page
  for (var i = 0; i < children.length; i++) {
    const childHeight = childrenHeights.current[i];
    const child = children[i];
    // If reached page height limit, stop adding children.
    if (sumChildrenHeights + childHeight > pageHeight) {
      break;
    } else {
      // Add children to page
      sumChildrenHeights += childHeight;
      page.push(child);
    }
  }

  // Only header
  if (hasHeader && !hasFooter) {
    page = [header, ...page];
  }
  // Only footer
  if (hasFooter && !hasHeader) {
    page.push(footer);
  }
  // Header and footer
  if (hasHeader && hasFooter) {
    page = [header, ...page, footer];
  }

  return { page, childrenAdded: i };
};

export const fragmentPages = ({ children, childrenHeights, config }) => {
  let pages = [];
  // Header & Footer here won't be displayed, they are used for calculations.
  const header = (config && config.header && config.header.component) || <Header />;
  const headerHeight = (config && config.header && config.header.height) || DefaultHeaderHeight;
  const footer = (config && config.footer && config.footer.component) || <Footer />;
  const footerHeight = (config && config.footer && config.footer.height) || DefaultFooterHeight;
  let newChildren = [...children]; // will be spliced until its empty.

  const pageParams = {
    header,
    headerHeight,
    footer,
    footerHeight,
    children: newChildren,
    childrenHeights,
  };

  while (newChildren.length > 0) {
    const pageResult = fillPage(pageParams);
    newChildren.splice(0, pageResult.childrenAdded);
    pages.push(pageResult.page);
  }

  return pages;
};

export const isEmptyObject = (empty) => {
  return Object.keys(empty).length === 0 && empty.constructor === Object;
};
