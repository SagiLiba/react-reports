import React, { useState, useRef, useEffect } from 'react';
import { measureHeight } from './../MeasureComponent/MeasureComponent';

export const AsyncChild = ({ _notifyHeight, _saveState, _savedState }) => {
  // console.log('Async Child:', props);

  const [texts, setTexts] = useState(_savedState ? _savedState.texts : []);
  const asyncElement = useRef();

  // Async loading data
  useEffect(() => {
    setTimeout(() => {
      setTexts(['Async text one', 'Async text two', 'Äsync text three']);
    }, 2000);
  }, []);

  useEffect(() => {
    // You must notify the height of the child only after it has rendered all of its async behavior, APIs, images, text, etc...
    // You must also save your async information using _saveState to avoid recalling the state in the next child creation
    // TODO: Understand why removing _savedState from the if statement does not impair the logic
    // console.log(_savedState);
    if (texts.length > 0 && !_savedState) {
      _notifyHeight && _notifyHeight(measureHeight(asyncElement.current));
      _saveState &&
        _saveState({
          texts,
        });
    }
  });

  return (
    <div className={'async-text'} ref={asyncElement}>
      {texts.map((text, index) => {
        return (
          <h2 key={index}>
            {index + 1}. {text}
          </h2>
        );
      })}
    </div>
  );
};
