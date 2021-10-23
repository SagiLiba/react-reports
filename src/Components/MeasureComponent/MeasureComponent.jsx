import React, { useEffect, useRef } from 'react';

export const MeasureComponent = ({ children, notifyHeight }) => {
  let childRef = useRef();

  if (children.length > 1) {
    throw new Error('react-reports: MeasureComponent can measure only one child at a time.');
  }

  useEffect(() => {
    if (childRef) {
      const elementHeight = childRef.clientHeight;
      notifyHeight(elementHeight);
    }
  }, []);

  return <div ref={(ref) => (childRef = ref)}>{children}</div>;
};
