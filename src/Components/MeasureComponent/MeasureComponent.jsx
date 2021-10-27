import React, { useEffect, useRef } from 'react';

// --------------------------------------------------
// Overflow auto, makes sure the height calculations
// will include the margins
// --------------------------------------------------
export const OverflowAuto = React.forwardRef(({ children }, ref) => {
  return (
    <div style={{ overflow: 'auto' }} ref={ref}>
      {children}
    </div>
  );
});

const getElementMargins = (element) => {
  const elementComputedStyle = window.getComputedStyle(element);
  let marginTop = 0;
  let marginBottom = 0;
  let marginLeft = 0;
  let marginRight = 0;

  try {
    marginTop = parseInt(elementComputedStyle.marginTop);
    marginBottom = parseInt(elementComputedStyle.marginBottom);
    marginLeft = parseInt(elementComputedStyle.marginLeft);
    marginRight = parseInt(elementComputedStyle.marginRight);
  } catch (error) {
    marginTop = 0;
    marginBottom = 0;
    marginLeft = 0;
    marginRight = 0;
    console.error('Could not parse element margins, used 0 value for height calculation', element);
  }
  return {
    marginBottom,
    marginLeft,
    marginTop,
    marginRight,
  };
};

export const measureHeight = (element) => {
  if (!element) {
    console.error('No element was supplied to measureHeight function.');
    return 0;
  }
  const { marginTop, marginBottom } = getElementMargins(element);
  const elementRect = element.getBoundingClientRect();

  if (elementRect) {
    return elementRect.height + marginTop + marginBottom;
  }

  console.error('Could not calculate boundClientRect for element', element);
  return 0;
};

export const MeasureComponent = ({ children, notifyHeight }) => {
  let childRef = useRef();

  if (children.length > 1) {
    throw new Error('react-reports: MeasureComponent can measure only one child at a time.');
  }

  useEffect(() => {
    if (childRef) {
      notifyHeight(measureHeight(childRef));
    }
  }, []);

  return <OverflowAuto ref={(ref) => (childRef = ref)}>{children}</OverflowAuto>;
};
