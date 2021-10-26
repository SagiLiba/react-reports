import { createContext, useEffect, useRef, useState } from 'react';
import './ReportStyles.scss';
import { useReportContextHelper } from './useReportContextHelper';

export const ReportContext = createContext({});

export const ReportContextProvider = ({ config, children }) => {
  const pageCounter = useRef(0);
  const { readyForPrint, readyForAddingPageNumbers, pagesInfo, updatePageGroup, registerPageGroup, updatePageNumber } =
    useReportContextHelper();
  const [handledAPIRequests, setHandledAPIRequests] = useState(false);
  const [handledInitialValues, setHandledInitialValues] = useState(false);

  const [reportData, setReportData] = useState({
    initial: {},
    requests: {},
    rejectedRequests: {},
  });

  const getPageId = () => {
    pageCounter.current += 1;
    return pageCounter.current;
  };

  // -----------------------------------------------------
  // The developer can supply a list of APIs that will be
  // requests before the report generation starts.
  // He can then access it through "useReport" directly.
  // ----------------------------------------------------
  const handleApiRequests = async (apis) => {
    let requests = [];
    let processingFunctions = [];
    let putOnProps = [];

    apis.forEach(({ request, processingFunction, putOnProp }) => {
      requests.push(request);
      processingFunctions.push(processingFunction);
      putOnProps.push(putOnProp);
    });

    const responses = await Promise.allSettled(requests);

    let data = {};
    let rejected = {};

    responses.forEach((response, index) => {
      const property = putOnProps[index];
      const processingFunction = processingFunctions[index];

      if (response.status === 'fulfilled') {
        data[property] = processingFunction(response.value);
      } else {
        rejected[property] = response;
      }
    });

    setReportData((current) => {
      return {
        ...current,
        requests: data,
        rejectedRequests: rejected,
      };
    });
  };

  // --------------------------------------------------------------
  // The developer can supply a list of initial values that will be
  // supplied before the report generation starts.
  // He can then access it through "useReport" directly.
  // --------------------------------------------------------------
  const handleInitialValues = (values) => {
    const initialData = {};

    values.forEach(({ putOnProp, value }) => {
      initialData[putOnProp] = value;
    });

    setReportData((current) => {
      let newCurrent = {
        ...current,
        initial: initialData,
      };
      return newCurrent;
    });
  };

  // ----------------------------------------------------
  // Handle APIs and Initial Values set by the developer.
  // ----------------------------------------------------
  useEffect(() => {
    const apis = config && config.apis;
    const initialValues = config && config.initialValues;

    if (apis) {
      // The user has requests that needs to be resolved.
      handleApiRequests(apis);
    } else {
      // No APIs, flag as done with apis.
      setHandledAPIRequests(true);
    }

    if (initialValues) {
      // The user has supplied initial values.
      handleInitialValues(initialValues);
    } else {
      // No initial values, flag as done with initial values.
      setHandledInitialValues(true);
    }
  }, []);

  useEffect(() => {
    // APIs were handeled
    const hasRequests = Object.values(reportData.requests).length > 0;
    const hasRejectedRequests = Object.values(reportData.rejectedRequests).length > 0;

    if (hasRequests || hasRejectedRequests) {
      setHandledAPIRequests(true);
    }

    // InitialValues were handled
    const configHasInitialValues = !!config.initialValues && config.initialValues.length > 0;
    const initialValuesHandled = Object.values(reportData.initial).length > 0;

    if (configHasInitialValues && initialValuesHandled) {
      setHandledInitialValues(true);
    }
  }, [reportData]);

  const providedValue = {
    registerPageGroup,
    updatePageGroup,
    getPageId,
    pagesInfo,
    readyForPrint,
    readyForAddingPageNumbers,
    updatePageNumber,
    reportData,
  };

  // -----------------------------------------------------
  // Do not render until all the API requests are handled.
  // -----------------------------------------------------
  if (!handledAPIRequests) {
    return <></>;
  }
  // -------------------------------------------------------
  // Do not render until all the initial values are handled.
  // -------------------------------------------------------
  if (!handledInitialValues) {
    return <></>;
  }

  // -------------------------------------------------------------------------
  // Start rendering the report, only after APIs & initialValues were handled.
  // -------------------------------------------------------------------------
  return (
    <ReportContext.Provider value={providedValue}>
      <section className='report'>
        {children}
        {readyForPrint && <div id={'ready-for-print'} />}
      </section>
    </ReportContext.Provider>
  );
};
