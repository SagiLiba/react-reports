import React, { useContext, useEffect, useRef, useState } from 'react';
import { ReportContext } from '../../Contexts/ReportContext';
import { MeasureComponent } from '../MeasureComponent/MeasureComponent';
import { Page } from '../Page/Page';
import { useReport } from '../useReport';
import { fragmentPages, PageSize, RenderPhase, splitPages } from './../ReportsLib';

// Todo: Remove delayed prop

const PagesSplitInner = ({ children, delayed, name = '', reportData }) => {
  const reportContext = useContext(ReportContext);
  const report = useReport();
  console.log(report);
  const [renderPhase, setRenderPhase] = useState(RenderPhase.MEASURE);
  const [PagesSplitContextId, setPagesSplitContextId] = useState();
  const [splitPages, setSplitPages] = useState([]);
  const childrenHeights = useRef({});

  const handleChildHeight = (childIndex) => (height) => {
    childrenHeights.current[childIndex] = height;
  };

  const splitToPages = () => {
    const splitPages = fragmentPages({ children, childrenHeights });
    setSplitPages(splitPages);
    setRenderPhase(RenderPhase.PAGES_READY);
  };

  useEffect(() => {
    const PagesSplitId = reportContext.registerPageSplit();
    setPagesSplitContextId(PagesSplitId);
    setRenderPhase(RenderPhase.SPLIT_TO_PAGES);
  }, []);

  useEffect(() => {
    if (renderPhase === RenderPhase.PAGES_READY) {
      if (delayed) {
        setTimeout(() => {
          reportContext.updatePageSplit({
            id: PagesSplitContextId,
            ready: true,
            pagesAmount: splitPages.length,
            data: { name },
          });
        }, delayed);
      }
    }
    if (renderPhase === RenderPhase.SPLIT_TO_PAGES) {
      splitToPages();
    }
  }, [renderPhase]);

  /** Rendering Phases  **/

  if (renderPhase === RenderPhase.MEASURE) {
    return children.map((child, index) => {
      return (
        <MeasureComponent key={index} notifyHeight={handleChildHeight(index)} childIndex={index}>
          {child}
        </MeasureComponent>
      );
    });
  }

  if (renderPhase === RenderPhase.PAGES_READY) {
    return splitPages.map((pageComponents, index) => {
      return <Page key={index}>{pageComponents}</Page>;
    });
  }

  return <></>;
};

export const PagesSplit = PagesSplitInner;
