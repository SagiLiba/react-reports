import React from 'react';
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

const fillPage = ({
  children,
  childrenHeights,
  headerComponent,
  headerHeight,
  footerComponent,
  footerHeight,
  repeatingTopComponent,
  repeatingTopHeight,
  repeatingBottomComponent,
  repeatingBottomHeight,
}) => {
  let page = [];
  let sumChildrenHeights = 0;
  let pageHeight = PageSize.A4.height;
  const hasHeader = headerComponent && headerHeight;
  const hasFooter = footerComponent && footerHeight;
  const hasRepeatingTopComponent = repeatingTopComponent && repeatingTopHeight;
  const hasRepeatingBottomComponent =
    repeatingBottomComponent && repeatingBottomHeight;

  // Account for header height
  if (hasHeader) {
    pageHeight -= headerHeight;
  }
  // Account for footer height
  if (hasFooter) {
    pageHeight -= footerHeight;
  }
  // Account for repeating top height
  if (hasRepeatingTopComponent) {
    pageHeight -= repeatingTopHeight;
  }
  // Account for repeating bottom height
  if (hasRepeatingBottomComponent) {
    pageHeight -= repeatingBottomHeight;
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

export const fragmentPages = ({
  children,
  childrenHeights,
  config,
  maxPages = null,
  repeating = null,
}) => {
  let pages = [];
  // ---------------------------------------------------------------
  // Header, Footer, repeatingTopComponent, repeatingBottomComponent
  // won't be displayed, they are used for calculations.
  // ---------------------------------------------------------------

  // Handle Header
  // -------------
  const headerObject = config && config.header;
  const headerComponent = (headerObject && headerObject.component) || (
    <Header />
  );
  const headerHeight =
    (headerObject && headerObject.height) || DefaultHeaderHeight;
  const headerDisplay = headerObject && headerObject.display;
  let showHeader =
    (typeof headerDisplay === 'boolean' && headerDisplay === true) ||
    (typeof headerDisplay !== 'boolean' && !headerDisplay);

  if (headerObject && isEmptyObject(headerObject)) {
    showHeader = true;
  }

  // -------------
  // Handle Footer
  // -------------
  const footerObject = config && config.footer;
  const footerComponent = (footerObject && footerObject.component) || (
    <Footer />
  );
  const footerHeight =
    (footerObject && footerObject.height) || DefaultFooterHeight;
  const footerDisplay = footerObject && footerObject.display;
  let showFooter =
    (typeof footerDisplay === 'boolean' && footerDisplay === true) ||
    (typeof footerDisplay !== 'boolean' && !footerDisplay);

  if (footerObject && isEmptyObject(footerObject)) {
    showFooter = true;
  }

  // --------------------
  // Handle Repeating Top
  // --------------------
  const repeatingTopObj = repeating && repeating.top;
  const repeatingTopComponent = repeatingTopObj && repeatingTopObj.component;
  const repeatingTopHeight = repeatingTopObj && repeatingTopObj.height;
  let showRepeatingTopComponent = showRepeatingComponent(repeating, 'top');

  // --------------------
  // Handle Repeating Top
  // --------------------
  const repeatingBottomObj = repeating && repeating.bottom;
  const repeatingBottomComponent =
    repeatingBottomObj && repeatingBottomObj.component;
  const repeatingBottomHeight = repeatingBottomObj && repeatingBottomObj.height;
  let showRepeatingBottomComponent = showRepeatingComponent(
    repeating,
    'bottom'
  );

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
    repeatingTopComponent: showRepeatingTopComponent
      ? repeatingTopComponent
      : null,
    repeatingTopHeight: showRepeatingTopComponent ? repeatingTopHeight : null,
    repeatingBottomComponent: showRepeatingBottomComponent
      ? repeatingBottomComponent
      : null,
    repeatingBottomHeight: showRepeatingBottomComponent
      ? repeatingBottomHeight
      : null,
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
  return (
    objKeys.filter((k) => requiredKeys.includes(k)).length ===
    requiredKeys.length
  );
};

export const showRepeatingComponent = (repeating, property) => {
  const propertyObj = repeating && repeating[property];
  const component = propertyObj && propertyObj.component;
  const height = propertyObj && propertyObj.height;

  if (component && height) {
    return true;
  }
  return false;
};
