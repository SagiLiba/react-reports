import React from 'react';

// -------------------------------------------
// Include padding and margins in calculation!
// -------------------------------------------
const defaultPadding = 40;
export const DefaultFooterHeight = 75 - defaultPadding;

export const Footer = ({ pageName = '', footerClass = '', height = DefaultFooterHeight }) => {
  let style = {
    height,
    // Default footer styles,
    // They are ignored if "footerClass" is provided.
    ...(!footerClass && {
      borderBottom: '1px solid black',
      fontSize: '24px',
      padding: '20px',
      fontWeight: 'bold',
    }),
  };

  return (
    <div className={footerClass} style={style}>
      {pageName} - Footer
    </div>
  );
};
