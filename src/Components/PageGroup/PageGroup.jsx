import React, { useContext } from 'react';
import { PageGroupContext, PageGroupProvider } from '../../Contexts/PageGroupContext';
import { GrouperFunction } from '../Grouper/Grouper';
import { MeasureComponent } from '../MeasureComponent/MeasureComponent';
import { Page } from '../Page/Page';
import { RenderPhase } from '../ReportsLib';
import { usePageGroup } from './usePageGroup';

// Todo: Remove delayed prop
// The Children in Measure and in Pages_Ready are DIFFERENT!
// Thats why async children must have their async data saved in the PageGroupContext
// and later taken from there.

const BasePageGroup = ({ children, delayed, name = '' }) => {
  const pageGroupContext = useContext(PageGroupContext);
  const { renderPhase, handleChildHeight, handleAsyncChildHeight, prepareChildrenForMeasurement, pages } = usePageGroup(
    {
      children,
      delayed,
      name,
    }
  );
  const parsedChildren = prepareChildrenForMeasurement(children);

  // ---------------------------
  // PageGroup Rendering Phases
  // ---------------------------
  // Measure each childs height:
  // ---------------------------
  if (renderPhase === RenderPhase.MEASURE) {
    return parsedChildren.map((child, index) => {
      const isAsyncChild = child.props.measureAsync;

      if (isAsyncChild) {
        return React.cloneElement(child, {
          ...child.props,
          key: index,
          _notifyHeight: handleAsyncChildHeight(index),
          _saveState: pageGroupContext.saveChildState(index),
          _savedState: pageGroupContext.savedChildrenStates[index] || null,
        });
      }

      return (
        <MeasureComponent key={index} notifyHeight={handleChildHeight(index)} childIndex={index}>
          {child}
        </MeasureComponent>
      );
    });
  }

  // -------------------------
  // Return all created pages:
  // -------------------------

  /**
   * Every map s
   */
  if (renderPhase === RenderPhase.PAGES_READY) {
    // Incremented when mapping over the pages,
    // used to make sure that async elements get their
    // correct index and fetch their saved state.
    let elementsIndex = -1;

    return pages.map((pageComponents, index) => {
      return (
        // Page key must be identical throughout renders!
        // Otherwise it will cause a potential memory leak.
        <Page key={index}>
          {React.Children.map(pageComponents, (child, index) => {
            // Keeping correct saved state mapping to async elements.
            elementsIndex++;
            const isAsyncChild = child.props.measureAsync;

            if (isAsyncChild) {
              return React.cloneElement(child, {
                ...child.props,
                key: elementsIndex,
                _savedState: pageGroupContext.savedChildrenStates[elementsIndex] || null,
              });
            }

            return child;
          })}
        </Page>
      );
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
