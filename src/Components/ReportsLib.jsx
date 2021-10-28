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
  Test cases:
  - header/footer - empty object {}
  - header & footer - default
  - no header & no footer
  - only no footer
  - only no header
  - object with irrelevant props, check it does not change behavior
  - custom header & custom footer
*/

const fillPage = ({ children, childrenHeights, headerComponent, headerHeight, footerComponent, footerHeight }) => {
  let page = [];
  let sumChildrenHeights = 0;
  let pageHeight = PageSize.A4.height;
  const hasHeader = headerComponent && headerHeight;
  const hasFooter = footerComponent && footerHeight;

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
    const childHeight = childrenHeights[i];
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

  return { page, childrenAdded: i };
};

export const fragmentPages = ({ children, childrenHeights, config, maxPages = null }) => {
  let pages = [];
  // Header & Footer here won't be displayed, they are used for calculations.
  const headerObject = config && config.header;
  const headerComponent = (headerObject && headerObject.component) || <Header />;
  const headerHeight = (headerObject && headerObject.height) || DefaultHeaderHeight;
  const headerDisplay = headerObject && headerObject.display;
  let showHeader =
    (typeof headerDisplay === 'boolean' && headerDisplay === true) ||
    (typeof headerDisplay !== 'boolean' && !headerDisplay);

  if (headerObject && isEmptyObject(headerObject)) {
    showHeader = true;
  }

  const footerObject = config && config.footer;
  const footerComponent = (footerObject && footerObject.component) || <Footer />;
  const footerHeight = (footerObject && footerObject.height) || DefaultFooterHeight;
  const footerDisplay = footerObject && footerObject.display;
  let showFooter =
    (typeof footerDisplay === 'boolean' && footerDisplay === true) ||
    (typeof footerDisplay !== 'boolean' && !footerDisplay);

  if (footerObject && isEmptyObject(footerObject)) {
    showFooter = true;
  }

  // ------------------------------------------------------------------------------------------------------
  // These objects variables will be used to push new children to pages based on their heights
  // In order to advance the calculation, I have to remove the newChildren and newChildrenHeights
  // after each calculation until their empty.
  let newChildren = [...children]; // will be spliced until its empty.
  let newChildrenHeights = Object.values(childrenHeights.current); // // will be truncated until its empty.
  // ------------------------------------------------------------------------------------------------------

  const pageParams = {
    headerComponent: showHeader ? headerComponent : null,
    headerHeight: showHeader ? headerHeight : null,
    footerComponent: showFooter ? footerComponent : null,
    footerHeight: showFooter ? footerHeight : null,
    children: newChildren,
    childrenHeights: newChildrenHeights,
  };

  while (newChildren.length > 0) {
    const pageResult = fillPage(pageParams);
    newChildren.splice(0, pageResult.childrenAdded);
    newChildrenHeights.splice(0, pageResult.childrenAdded);
    pages.push(pageResult.page);
    // Stop filling pages with child components,
    // when reaching the maximum allowed pages.
    if (maxPages === pages.length) {
      break;
    }
  }

  return pages;
};

export const isEmptyObject = (empty) => {
  return Object.keys(empty).length === 0 && empty.constructor === Object;
};

export const isObjectWithRequiredProperties = (obj, requiredKeys) => {
  const objKeys = Object.keys(obj);
  return objKeys.filter((k) => requiredKeys.includes(k)).length === requiredKeys.length;
};
