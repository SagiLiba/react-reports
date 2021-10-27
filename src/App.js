import React from 'react';
import './App.scss';
import { AsyncChild } from './Components/AsyncChild/AsyncChild';
import { Grouper } from './Components/Grouper/Grouper';
import { PageGroup } from './Components/PageGroup/PageGroup';
import { TableOfContents } from './Components/TableOfContents/TableOfContents';
import { ReportProvider } from './Contexts/ReportContext';

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
      <ReportProvider config={reportConfig}>
        <TableOfContents />
        {/* <PageGroup delayed={1000} name='One'>
          <div className='one'>Page One</div>
          <div className='two'>Page One</div>
        </PageGroup> */}
        <PageGroup delayed={300} name='Two'>
          {/* <div className='five'>Page Two</div> */}
          {/* <AsyncChild measureAsync /> */}
          {/* <div className='one'>Page Two</div> */}
          {/* <AsyncChild measureAsync /> */}
          <AsyncChild measureAsync />
          {/* <div className='three'>Page Two</div> */}
          {/* <AsyncChild measureAsync /> */}
          {/* <AsyncChild measureAsync /> */}
          {/* <Grouper groupEvery={2}>
            <div>A</div>
            <div>B</div>
            <div>C</div>
            <div>D</div>
            <div>E</div>
            <div>F</div>
            <div>G</div>
            <div>H</div>
            <div>I</div>
            <div>J</div>
            <div>K</div>
            <div>L</div>
          </Grouper> */}
          {/* <div className='four'>Page Two</div> */}
        </PageGroup>
        {/* <PageGroup delayed={100} name='Three'>
          <div className='three'>Page Three</div>
          <div className='two'>Page Three</div>
          <div className='five'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='one'>Page Three</div>
        </PageGroup> */}
      </ReportProvider>
    </div>
  );
}

export default App;
