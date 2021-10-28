import React from 'react';

// ----------------------------------------------
// Absolute position component at the bottom left
// ----------------------------------------------
export const ToBottom = React.forwardRef(({ children }, ref) => {
  return (
    <div style={{ position: 'absolute', bottom: 0, left: 0, width: 'inherit' }} ref={ref}>
      {children}
    </div>
  );
});

// ----------------------------------------------
// Absolute position component at the top left
// ----------------------------------------------
export const ToTop = React.forwardRef(({ children }, ref) => {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: 'inherit' }} ref={ref}>
      {children}
    </div>
  );
});
