import React, { useState, useRef, useEffect } from 'react';

function withShouldComponentUpdate(WrappedComponent, compare) {
  return class extends React.Component {
    constructor(props) {
      super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
      console.log(this.props);
      return false;
      // console.log('Should update');
      // console.log(compare(nextProps, nextState));
      // if (!compare) {
      //   throw new Error('withShouldComponentUpdate HOC needs a comparison function');
      // }
      // return false;
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}

/* Props changing causing the component to render again */

export const AsyncChild = withShouldComponentUpdate(
  (props) => {
    // console.log('Async Child:', props);
    const [texts, setTexts] = useState([]);
    const once = useRef(true);
    const asyncElement = useRef();

    // Async loading data
    useEffect(() => {
      setTimeout(() => {
        setTexts(['Async text one', 'Async text two', 'Äsync text three']);
      }, 2000);
    }, []);

    useEffect(() => {
      // You must notify the height of the child only after it has rendered all of its async behavior, APIs, images, text, etc...
      if (texts.length > 0 && once.current) {
        console.log(asyncElement.current.children);
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
  },
  (nextProps, nextState) => {
    console.log('Yo');
    return false;
  }
);
