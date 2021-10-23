import React, { useContext, useEffect, useRef, useState } from 'react';
import { ReportContext } from '../../Contexts/ReportContext';
import { MeasureComponent } from '../MeasureComponent/MeasureComponent';
import { Page } from '../Page/Page';
import { PageSize, RenderPhase } from './../ReportsLib';

export const PagesSplit = ({ children }) => {
  const reportContext = useContext(ReportContext);
  const [renderPhase, setRenderPhase] = useState(RenderPhase.MEASURE);
  const [splitPages, setSplitPages] = useState([]);
  const childrenHeights = useRef({});

  const handleChildHeight = (childIndex) => (height) => {
    childrenHeights.current[childIndex] = height;
  };

  const splitToPages = () => {
    let pages = [[]];
    let currentPage = 0;
    let sumChildrenHeights = 0;
    const A4Height = PageSize.A4.height;

    for (let i = 0; i < children.length; i++) {
      const childHeight = childrenHeights.current[i];

      if (sumChildrenHeights + childHeight > A4Height) {
        // Add child to next page
        currentPage += 1;
        sumChildrenHeights = childHeight;
        pages.push([children[i]]);
      } else {
        // Add child to page
        sumChildrenHeights += childHeight;
        pages[currentPage].push(children[i]);
      }
    }

    setSplitPages(pages);
    setRenderPhase(RenderPhase.PAGES_READY);
  };

  useEffect(() => {
    setRenderPhase(RenderPhase.SPLIT_TO_PAGES);
    splitToPages();
  }, []);

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
