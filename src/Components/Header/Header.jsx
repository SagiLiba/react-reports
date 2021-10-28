import React from 'react';
import { isEmptyObject } from '../ReportsLib';
import { isObjectWithRequiredProperties } from './../ReportsLib';

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
  const headerObject = config && config.header;
  const headerDisplay = headerObject && headerObject.display;
  const headerComponent = headerObject && headerObject.component;
  const headerHeight = headerObject && headerObject.height;
  const useDefaultHeader =
    !config ||
    !headerObject ||
    isEmptyObject(headerObject) ||
    !isObjectWithRequiredProperties(headerObject, ['height', 'display', 'component']) ||
    (typeof headerDisplay === 'boolean' && headerDisplay === true && (!headerComponent || !headerHeight));

  if (typeof headerDisplay === 'boolean' && headerDisplay === false) {
    return false;
  }

  if (useDefaultHeader) {
    return true;
  }

  if (!headerComponent || !headerHeight) {
    return false;
  }

  return true;
};
