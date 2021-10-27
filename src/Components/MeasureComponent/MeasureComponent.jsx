import React, { useEffect, useRef } from 'react';

export const measureHeight = (element) => {
  if (!element) {
    console.warn('No element was supplied to measureHeight function.');
    return 0;
  }

  const elementRect = element.getBoundingClientRect();
  if (elementRect) {
    return elementRect.height;
  }
  console.warn('Could not calculate boundClientRect for element', element);
  return 0;
};

export const MeasureComponent = ({ children, notifyHeight }) => {
  let childRef = useRef();

  if (children.length > 1) {
    throw new Error('react-reports: MeasureComponent can measure only one child at a time.');
  }

  useEffect(() => {
    if (childRef) {
      const borderPixelAmount = 2; // With border it seems that margin calculations are correct.
      notifyHeight(measureHeight(childRef) - borderPixelAmount);
    }
  }, []);

  return (
    <div ref={(ref) => (childRef = ref)} style={{ border: '1px solid black' }}>
      {children}
    </div>
  );
};
