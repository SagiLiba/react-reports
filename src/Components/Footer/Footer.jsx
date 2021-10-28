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
