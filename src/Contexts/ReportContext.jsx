import { createContext, useContext, useEffect, useState } from 'react';
import { isEmptyObject } from '../Components/ReportsLib';
import './ReportStyles.scss';

export const ReportContext = createContext({});
let pagesSplitComponentsAmount = 0;
let counter = 0;
let pageCounter = 0;

export const ReportContextProvider = ({ config, children }) => {
  const [handledAPIRequests, setHandledAPIRequests] = useState(false);
  const [handledInitialValues, setHandledInitialValues] = useState(false);
  const [reportData, setReportData] = useState({
    initial: {},
    requests: {},
    rejectedRequests: {},
  });
  const [pagesInfo, setPagesInfo] = useState({});
  const [readyForPrint, setReadyForPrint] = useState(false);

  const registerPageSplit = () => {
    pagesSplitComponentsAmount = pagesSplitComponentsAmount + 1;
    setPagesInfo((current) => ({
      ...current,
      [pagesSplitComponentsAmount - 1]: { ready: false, pagesAmount: 0, data: {} },
    }));
    return pagesSplitComponentsAmount - 1;
  };

  const updatePageSplit = ({ id, ready, pagesAmount, data }) => {
    setPagesInfo((current) => ({ ...current, [id]: { ready, pagesAmount, data } }));
  };

  const getPageId = () => {
    pageCounter += 1;
    return pageCounter;
  };

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

  useEffect(() => {
    let isPagesReady = false;

    if (!isEmptyObject(pagesInfo)) {
      isPagesReady = Object.values(pagesInfo).every((value) => value.ready);
    }

    const allPageSplitComponentsRegistered = pagesSplitComponentsAmount === Object.keys(pagesInfo).length;

    if (allPageSplitComponentsRegistered && isPagesReady) {
      console.log('Ready for print', pagesInfo);
      setReadyForPrint(true);
    }
  }, [pagesInfo]);

  useEffect(() => {
    if (config && config.apis) {
      // The user has requests that needs to be resolved.
      handleApiRequests(config.apis);
    } else {
      // No APIs, start creating the report
      setHandledAPIRequests(true);
    }

    if (config && config.initialValues) {
      const initialData = {};

      config.initialValues.forEach(({ putOnProp, value }) => {
        initialData[putOnProp] = value;
      });

      setReportData((current) => {
        let newCurrent = {
          ...current,
          initial: initialData,
        };
        return newCurrent;
      });
    } else {
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
    registerPageSplit,
    updatePageSplit,
    getPageId,
    pagesInfo,
    readyForPrint,
    reportData,
  };

  // Do not render until all the API requests are handled.
  if (!handledAPIRequests) {
    return <></>;
  }

  if (!handledInitialValues) {
    return <></>;
  }

  return (
    <ReportContext.Provider value={providedValue}>
      <section className='report'>
        {children}
        {readyForPrint && <div id={'ready-for-print'} />}
      </section>
    </ReportContext.Provider>
  );
};

// {React.Children.map(children, (child) => {
//   if (React.isValidElement(child)) {
//     return React.cloneElement(child, { reportData });
//   }
//   return child;
// })}
