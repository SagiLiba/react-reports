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

export const fragmentPages = ({ children, childrenHeights }) => {
  let pages = [[]];
  let currentPage = 0;
  let sumChildrenHeights = 0;
  const A4Height = PageSize.A4.height;

  for (let i = 0; i < children.length; i++) {
    const childHeight = childrenHeights.current[i];

    if (sumChildrenHeights + childHeight > A4Height) {
      // Add child to next page
      currentPage += 1;
      sumChildrenHeights = childHeight;
      pages.push([children[i]]);
    } else {
      // Add child to page
      sumChildrenHeights += childHeight;
      pages[currentPage].push(children[i]);
    }
  }

  return pages;
};

export const isEmptyObject = (empty) => {
  return Object.keys(empty).length === 0 && empty.constructor === Object;
};
