import React from 'react';
import { PageGroupProvider } from '../../Contexts/PageGroupContext';
import { MeasureComponent } from '../MeasureComponent/MeasureComponent';
import { Page } from '../Page/Page';
import { RenderPhase } from '../ReportsLib';
import { usePageGroup } from './usePageGroup';

// Todo: Remove delayed prop
// ShouldComponentUpdate HOC for notify height, making sure no update occurs causing the re-render.
// Going over the page components add the notifyHeight function WITH THE SAME REFERENCE.
// Idea - notifyHeight extracted to a hook, used inside AsyncChild, problem: child index

const BasePageGroup = ({ children, delayed, name = '' }) => {
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
    console.log('ready');
    return pages.map((pageComponents, index) => {
      return <Page key={index}>{pageComponents}</Page>;
    });
  }

  return <></>;
};

export const PageGroup = (props) => {
  return (
    <PageGroupProvider>
      <BasePageGroup {...props} />
    </PageGroupProvider>
  );
};
