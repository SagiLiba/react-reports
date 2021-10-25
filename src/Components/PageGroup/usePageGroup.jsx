import React, { useState, useEffect, useContext, useRef } from 'react';
import { fragmentPages, RenderPhase } from '../ReportsLib';
import { ReportContext } from './../../Contexts/ReportContext';

export const usePageGroup = ({ children, delayed, name }) => {
  const reportContext = useContext(ReportContext);
  const [renderPhase, setRenderPhase] = useState(RenderPhase.MEASURE);
  const [pageGroupId, setPageGroupId] = useState();
  const [splitPages, setSplitPages] = useState([]);
  const childrenHeights = useRef({});

  // ------------------------------------------------------------
  // Update the "childrenHeights" with the child component height
  // ------------------------------------------------------------
  const handleChildHeight = (childIndex) => (height) => {
    childrenHeights.current[childIndex] = height;
  };

  // --------------------------------------------------------------------------
  // Create pages and push child elements to them based on the children heights
  // --------------------------------------------------------------------------
  const splitToPages = () => {
    const splitPages = fragmentPages({ children, childrenHeights });
    setSplitPages(splitPages);
    setRenderPhase(RenderPhase.PAGES_READY);
  };

  // ------------------------------------------------
  // Register PageGroup component into ReportContext
  // ------------------------------------------------
  useEffect(() => {
    const registeredPageGroupId = reportContext.registerPageGroup();
    setPageGroupId(registeredPageGroupId);
    setRenderPhase(RenderPhase.SPLIT_TO_PAGES);
  }, []);

  // ---------------------------------------------
  // Handle the rendering phases of the PageGroup
  // ---------------------------------------------
  useEffect(() => {
    if (renderPhase === RenderPhase.PAGES_READY) {
      if (delayed) {
        setTimeout(() => {
          reportContext.updatePageGroup({
            id: pageGroupId,
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

  return { renderPhase, setRenderPhase, handleChildHeight, pageGroupId, pages: splitPages };
};
