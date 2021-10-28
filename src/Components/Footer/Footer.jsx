import React from 'react';

// -------------------------------------------
// Include padding and margins in calculation!
// -------------------------------------------
const defaultPadding = 40;
export const DefaultFooterHeight = 76;

export const Footer = ({
  pageName = '',
  footerClass = '',
  height = DefaultFooterHeight - defaultPadding,
  pageNumber = '',
}) => {
  let style = {
    height,
    // Default footer styles,
    // They are ignored if "footerClass" is provided.
    ...(!footerClass && {
      borderTop: '1px solid black',
      fontSize: '24px',
      padding: '20px',
      fontWeight: 'bold',
    }),
  };

  return (
    <div className={`react-reports-footer ${footerClass}`} style={style}>
      {pageNumber && <div className='page-number'>{pageNumber}</div>}
      {pageName}
    </div>
  );
};

export const shouldShowFooter = (config) => {
  const useDefaultFooter = !!(config && !config.footer);

  if (useDefaultFooter) {
    return true;
  }

  const footerDisplay = config && config.footer && config.footer.display;

  if (typeof footerDisplay === 'boolean' && footerDisplay === false) {
    return false;
  }

  const footerComponent = config && config.footer && config.footer.component;
  const footerHeight = config && config.footer && config.footer.height;

  if (!footerComponent || !footerHeight) {
    return false;
  }

  return true;
};
