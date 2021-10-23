import React, { useContext, useEffect, useRef, useState } from 'react';
import { ReportContext } from '../../Contexts/ReportContext';
import { MeasureComponent } from '../MeasureComponent/MeasureComponent';
import { Page } from '../Page/Page';
import { fragmentPages, PageSize, RenderPhase, splitPages } from './../ReportsLib';

const PagesSplitInner = ({ children }) => {
  const reportContext = useContext(ReportContext);
  const [renderPhase, setRenderPhase] = useState(RenderPhase.MEASURE);
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
    setRenderPhase(RenderPhase.SPLIT_TO_PAGES);
    splitToPages();
  }, []);

  useEffect(() => {
    if (renderPhase === RenderPhase.PAGES_READY) {
    }
  }, [renderPhase]);

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
