import React, { useContext, useEffect, useRef, useState } from 'react';
import { GrouperFunction } from '../Grouper/Grouper';
import { fragmentPages, isEmptyObject, RenderPhase } from '../ReportsLib';
import { ReportContext } from './../../Contexts/ReportContext';
import { Header } from './../Header/Header';

export const usePageGroup = ({ children, name, maxPages = null }) => {
  const reportContext = useContext(ReportContext);

  const [renderPhase, setRenderPhase] = useState(RenderPhase.MEASURE);
  const [pageGroupId, setPageGroupId] = useState();
  const [splitPages, setSplitPages] = useState([]);

  const [allChildrenHeights, setAllChildrenHeights] = useState({});
  const childrenHeights = useRef({});
  const asyncChildrenHeights = useRef({});
  const asyncChildrenCount = useRef(0);

  const spreadGrouperChildren = (children) => {
    let newChildren = [];

    // ------------------------------------------------------------------------------------
    // The Grouper component, groups together elements.
    // Here I'm spreading its children into the parent children,
    // So they will not be rendered under the same container.
    // Therefore allowing them to split into new pages, and not as a single unit/container.
    // ------------------------------------------------------------------------------------
    React.Children.forEach(children, (child, index) => {
      const isGrouperChild = child && child.type && child.type.name === 'Grouper';

      if (isGrouperChild) {
        const groupElements = GrouperFunction({ ...child.props });

        newChildren = [...newChildren, ...groupElements];
      } else {
        newChildren.push(child);
      }
    });
    return newChildren;
  };

  const prepareChildrenForMeasurement = (children) => {
    return spreadGrouperChildren(children);
  };

  const updateAsyncChildrenCount = () => {
    let count = 0;
    React.Children.forEach(children, (child) => {
      const isAsyncChild = child.props.measureAsync;
      isAsyncChild && count++;
    });
    asyncChildrenCount.current = count;
  };
  // ------------------------------------------------------------
  // Update the "childrenHeights" with the child component height
  // ------------------------------------------------------------
  const handleChildHeight = (childIndex) => (height) => {
    childrenHeights.current[childIndex] = height;
  };
  // -----------------------------------------------------------------
  // Update the "asyncChildrenHeights" with the child component height
  // Detect when all async children have notified their height.
  // -----------------------------------------------------------------
  const handleAsyncChildHeight = (childIndex) => (height) => {
    asyncChildrenHeights.current[childIndex] = height;

    const hasAllAsyncChildrenNotifiedTheirHeights =
      asyncChildrenCount.current === Object.keys(asyncChildrenHeights.current).length;
    if (hasAllAsyncChildrenNotifiedTheirHeights) {
      setAllChildrenHeights({ ...childrenHeights.current, ...asyncChildrenHeights.current });
    }
  };
  // --------------------------------------------------------------------------
  // Create pages and push child elements to them based on the children heights
  // --------------------------------------------------------------------------
  const splitToPages = () => {
    const _childrenHeights = isEmptyObject(allChildrenHeights) ? childrenHeights : { current: allChildrenHeights };
    const _children = prepareChildrenForMeasurement(children);
    const splitPages = fragmentPages({
      children: _children,
      childrenHeights: _childrenHeights,
      config: reportContext.config,
      maxPages,
    });
    setSplitPages(splitPages);
    setRenderPhase(RenderPhase.PAGES_READY);
  };
  // ------------------------------------------------
  // Register PageGroup component into ReportContext
  // ------------------------------------------------
  useEffect(() => {
    const registeredPageGroupId = reportContext.registerPageGroup();
    setPageGroupId(registeredPageGroupId);
    updateAsyncChildrenCount();
  }, []);
  // ---------------------------------------------------------
  // When sync and async children have notified their heights,
  // start the page split phase
  // ---------------------------------------------------------
  useEffect(() => {
    const hasAsyncChildren = asyncChildrenCount.current > 0;
    if (hasAsyncChildren) {
      if (!isEmptyObject(allChildrenHeights)) {
        setRenderPhase(RenderPhase.SPLIT_TO_PAGES);
      }
    } else {
      // No async children
      setRenderPhase(RenderPhase.SPLIT_TO_PAGES);
    }
  }, [allChildrenHeights]);
  // ---------------------------------------------
  // Handle the rendering phases of the PageGroup
  // ---------------------------------------------
  useEffect(() => {
    if (renderPhase === RenderPhase.PAGES_READY) {
      reportContext.updatePageGroup({
        id: pageGroupId,
        ready: true,
        pagesAmount: splitPages.length,
        data: { name },
      });
    }
    if (renderPhase === RenderPhase.SPLIT_TO_PAGES) {
      splitToPages();
    }
  }, [renderPhase]);

  return {
    renderPhase,
    setRenderPhase,
    handleChildHeight,
    handleAsyncChildHeight,
    prepareChildrenForMeasurement,
    pageGroupId,
    pages: splitPages,
  };
};
