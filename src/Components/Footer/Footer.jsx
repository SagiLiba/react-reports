import React from 'react';
import { isEmptyObject, isObjectWithRequiredProperties } from '../ReportsLib';

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
    </div>
  );
};

export const shouldShowFooter = (config) => {
  const footerObject = config && config.footer;
  const footerDisplay = footerObject && footerObject.display;
  const footerComponent = footerObject && footerObject.component;
  const footerHeight = footerObject && footerObject.height;
  const useDefaultFooter =
    !config ||
    !footerObject ||
    isEmptyObject(footerObject) ||
    !isObjectWithRequiredProperties(footerObject, ['height', 'display', 'component']) ||
    (typeof footerDisplay === 'boolean' && footerDisplay === true && (!footerComponent || !footerHeight));

  if (typeof footerDisplay === 'boolean' && footerDisplay === false) {
    return false;
  }

  if (useDefaultFooter) {
    return true;
  }

  if (!footerComponent || !footerHeight) {
    return false;
  }

  return true;
};
