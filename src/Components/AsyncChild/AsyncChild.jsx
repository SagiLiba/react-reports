import React, { useState, useRef, useEffect } from 'react';

export const AsyncChild = (props) => {
  // console.log('Async Child:', props);
  const [texts, setTexts] = useState([]);
  const once = useRef(true);
  const asyncElement = useRef();

  // Async loading data
  useEffect(() => {
    setTimeout(() => {
      setTexts(['Async text one', 'Async text two', 'Äsync text three']);
    }, 1500);
  }, []);

  useEffect(() => {
    // You must notify the height of the child only after it has rendered all of its async behavior, APIs, images, text, etc...
    if (texts.length > 0 && once.current) {
      props.notifyHeight && props.notifyHeight(asyncElement.current.clientHeight);
      once.current = false;
    }
  }, [texts]);

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
