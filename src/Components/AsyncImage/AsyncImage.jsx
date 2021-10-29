import React, { useState, useRef, useEffect } from 'react';
import { measureHeight, OverflowAuto } from './../MeasureComponent/MeasureComponent';

export const AsyncImage = ({ url, _notifyHeight, _saveState, _savedState, imageProps = {} }) => {
  const [imageLoaded, setImageLoaded] = useState(_savedState ? _savedState.imageLoaded : false);
  const asyncElement = useRef();

  useEffect(() => {
    if (imageLoaded && !_savedState) {
      _notifyHeight && _notifyHeight(measureHeight(asyncElement.current));
      _saveState &&
        _saveState({
          imageLoaded,
        });
    }
  });

  return (
    // Use Overflow auto for correct height calcualtions
    // Referencing it will return an element with correct height.
    <OverflowAuto ref={asyncElement}>
      <img src={url} onLoad={() => setImageLoaded(true)} {...imageProps} />
    </OverflowAuto>
  );
};
