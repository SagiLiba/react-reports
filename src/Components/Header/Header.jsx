import React from 'react';

// -------------------------------------------
// Include padding and margins in calculation!
// -------------------------------------------
const defaultPadding = 40;
export const DefaultHeaderHeight = 76;

export const Header = ({ pageName = '', headerClass = '', height = DefaultHeaderHeight - defaultPadding }) => {
  let style = {
    height,
    // Default header styles,
    // They are ignored if "headerClass" is provided.
    ...(!headerClass && {
      borderBottom: '1px solid black',
      fontSize: '24px',
      padding: '20px',
      fontWeight: 'bold',
    }),
  };

  return (
    <div className={headerClass} style={style}>
      {pageName}
    </div>
  );
};

export const shouldShowHeader = (config) => {
  const useDefaultHeader = !!(config && !config.header);

  if (useDefaultHeader) {
    return true;
  }

  const headerDisplay = config && config.header && config.header.display;

  if (typeof headerDisplay === 'boolean' && headerDisplay === false) {
    return false;
  }

  const headerComponent = config && config.header && config.header.component;
  const headerHeight = config && config.header && config.header.height;

  if (!headerComponent || !headerHeight) {
    return false;
  }

  return true;
};
