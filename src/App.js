import './App.scss';
import React, { useRef } from 'react';
import { PageGroup } from './Components/PageGroup/PageGroup';
import { Page } from './Components/Page/Page';
import { ReportContextProvider } from './Contexts/ReportContext';
import { TableOfContents } from './Components/TableOfContents/TableOfContents';
import { Grouper } from './Components/Grouper/Grouper';
import { useEffect, useState } from 'react';
import { AsyncChild } from './Components/AsyncChild/AsyncChild';

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

/**
 * Order has changed, I've counted on the syncrhonous order of the PageGroup, to corretly show the pages in order
 * Now the async pages are rendered after wards.
 * **/
function App() {
  return (
    <div className='App'>
      <ReportContextProvider config={reportConfig}>
        <TableOfContents />
        <PageGroup delayed={1000} name='One'>
          <div className='one'>Page One</div>
          <div className='two'>Page One</div>
        </PageGroup>
        <PageGroup delayed={300} name='Two'>
          <div className='four'>Page Two</div>
          <AsyncChild measureAsync />
          <AsyncChild measureAsync />
          <AsyncChild measureAsync />
          <AsyncChild measureAsync />
          <div className='one'>Page Two</div>
          <div className='five'>Page Two</div>
          <div className='three'>Page Two</div>
          <Grouper groupEvery={2}>
            <div>A</div>
            <div>B</div>
            <div>C</div>
            <div>D</div>
            <div>E</div>
            <div>F</div>
            <div>G</div>
            <div>H</div>
            <div>I</div>
          </Grouper>
        </PageGroup>
        <PageGroup delayed={100} name='Three'>
          <div className='three'>Page Three</div>
          <div className='two'>Page Three</div>
          <div className='five'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='one'>Page Three</div>
        </PageGroup>
      </ReportContextProvider>
    </div>
  );
}

export default App;
