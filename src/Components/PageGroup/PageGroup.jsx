import React from 'react';
import { MeasureComponent } from '../MeasureComponent/MeasureComponent';
import { Page } from '../Page/Page';
import { RenderPhase } from '../ReportsLib';
import { usePageGroup } from './usePageGroup';

// Todo: Remove delayed prop

export const PageGroup = ({ children, delayed, name = '' }) => {
  const { renderPhase, handleChildHeight, handleAsyncChildHeight, pages } = usePageGroup({ children, delayed, name });

  // ---------------------------
  // PageGroup Rendering Phases
  // ---------------------------

  // Measure each childs height:
  if (renderPhase === RenderPhase.MEASURE) {
    return children.map((child, index) => {
      const isAsyncChild = child.props.measureAsync;

      if (isAsyncChild) {
        return React.cloneElement(child, { ...child.props, notifyHeight: handleAsyncChildHeight(index), key: index });
      }

      return (
        <MeasureComponent key={index} notifyHeight={handleChildHeight(index)} childIndex={index}>
          {child}
        </MeasureComponent>
      );
    });
  }
  // Return all created pages:
  if (renderPhase === RenderPhase.PAGES_READY) {
    return pages.map((pageComponents, index) => {
      return <Page key={index}>{pageComponents}</Page>;
    });
  }

  return <></>;
};
