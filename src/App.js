import './App.scss';
import { PagesSplit } from './Components/PagesSplit/PagesSplit';
import { Page } from './Components/Page/Page';
import { ReportContextProvider } from './Contexts/ReportContext';
import { TableOfContents } from './Components/TableOfContents/TableOfContents';

const promiseOne = new Promise((resolve) => resolve({ status: true, data: ['one', 'two', 'three'] }));
const promiseTwo = new Promise((resolve) => resolve({ status: true, data: ['four', 'five', 'six'] }));
const promiseThree = new Promise((resolve, reject) => reject('Error'));

const reportConfig = {
  initialValues: [
    { putOnProp: 'four', value: { someAPI: 'Four Values' } },
    { putOnProp: 'five', value: { someAPI: 'Five Values' } },
  ],
  apis: [
    { request: promiseOne, processingFunction: (response) => response.data, putOnProp: 'one' },
    { request: promiseTwo, processingFunction: (response) => response.data, putOnProp: 'two' },
    { request: promiseThree, processingFunction: (response) => response.data, putOnProp: 'three' },
  ],
};

function App() {
  return (
    <div className='App'>
      <ReportContextProvider config={reportConfig}>
        <TableOfContents />
        {/* <PagesSplit delayed={1000} name='One'>
          <div className='one'>Page One</div>
          <div className='two'>Page One</div>
        </PagesSplit> */}
        <PagesSplit delayed={300} name='Two'>
          <div className='four'>Page Two</div>
          <div className='one'>Page Two</div>
          <div className='five'>Page Two</div>
          <div className='three'>Page Two</div>
        </PagesSplit>
        {/* <PagesSplit delayed={100} name='Three'>
          <div className='three'>Page Three</div>
          <div className='two'>Page Three</div>
          <div className='five'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='one'>Page Three</div>
        </PagesSplit> */}
      </ReportContextProvider>
    </div>
  );
}

export default App;
