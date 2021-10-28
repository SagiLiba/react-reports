import React, { useContext, useMemo } from 'react';
import { PageGroupContext, PageGroupProvider } from '../../Contexts/PageGroupContext';
import { GrouperFunction } from '../Grouper/Grouper';
import { MeasureComponent } from '../MeasureComponent/MeasureComponent';
import { Page } from '../Page/Page';
import { RenderPhase } from '../ReportsLib';
import { usePageGroup } from './usePageGroup';
import { ReportContext } from './../../Contexts/ReportContext';
import { shouldShowHeader } from './../Header/Header';
import { shouldShowFooter } from '../Footer/Footer';

// The Children in Measure and in Pages_Ready are DIFFERENT!
// Thats why async children must have their async data saved in the PageGroupContext
// and later taken from there.

const BasePageGroup = ({ children, name = '', maxPages = null }) => {
  const reportContext = useContext(ReportContext);
  const pageGroupContext = useContext(PageGroupContext);
  const config = reportContext.config;
  const { renderPhase, handleChildHeight, handleAsyncChildHeight, prepareChildrenForMeasurement, pages } = usePageGroup(
    {
      children,
      name,
      maxPages,
    }
  );
  const parsedChildren = prepareChildrenForMeasurement(children);
  const showHeader = useMemo(() => shouldShowHeader(config), [config]);
  const showFooter = useMemo(() => shouldShowFooter(config), [config]);

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

  if (renderPhase === RenderPhase.PAGES_READY) {
    // Incremented when mapping over the pages,
    // used to make sure that async elements get their
    // correct index and fetch their saved state.
    let elementsIndex = -1;

    return pages.map((pageComponents, index) => {
      return (
        // Page key must be identical throughout renders!
        // Otherwise it will cause a potential memory leak.
        <Page key={index} name={name} showHeader={showHeader} showFooter={showFooter}>
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
