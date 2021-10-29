import React from 'react';
import './App.scss';
import { AsyncChild } from './Components/AsyncChild/AsyncChild';
import { Grouper } from './Components/Grouper/Grouper';
import { PageGroup } from './Components/PageGroup/PageGroup';
import { TableOfContents } from './Components/TableOfContents/TableOfContents';
import { ReportProvider } from './Contexts/ReportContext';
import { ToBottom } from './Functions';

const promiseOne = new Promise((resolve) => resolve({ status: true, data: ['one', 'two', 'three'] }));
const promiseTwo = new Promise((resolve) => resolve({ status: true, data: ['four', 'five', 'six'] }));
const promiseThree = new Promise((resolve, reject) => reject('Error'));

const CustomRepeatingTop = () => {
  return <div className={'custom-top'}>Repeating Top component</div>;
};

const CustomRepeatingBottom = () => {
  return <div className={'custom-bottom'}>Repeating Bottom component</div>;
};

const CustomFooter = ({ pageName = '', pageNumber = '' }) => {
  return (
    <ToBottom>
      <div className='custom-footer'>
        Footer - {pageName} - {pageNumber}
      </div>
    </ToBottom>
  );
};

const CustomHeader = ({ pageName = '', pageNumber = '' }) => {
  return (
    <div className='custom-header'>
      Header - {pageName} - {pageNumber}
    </div>
  );
};

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
  header: {
    display: true,
    component: CustomHeader,
    height: 88, // Any css margin / padding you added to custom header must be accounted for
  },

  footer: {
    // display: false,
    component: CustomFooter,
    height: 108, // Any css margin / padding you added to custom footer must be accounted for
  },
};

const PageGroupRepeating = {
  top: {
    component: CustomRepeatingTop,
    height: 50,
  },
  bottom: {
    component: CustomRepeatingBottom,
    height: 50,
  },
};

function App() {
  return (
    <div className='App'>
      <ReportProvider config={reportConfig}>
        <TableOfContents />
        <PageGroup name='Group One' repeating={PageGroupRepeating}>
          <div className='one'>Page One - with margins</div>
          <div className='two'>Page One</div>
          <AsyncChild measureAsync />
          <AsyncChild measureAsync />
          <AsyncChild measureAsync />
          <div className='two'>Page One</div>
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
          <div>M</div>
          <div className='two'>Page One</div>
          <div className='two'>Page One</div>
        </PageGroup>
        {/* <PageGroup name='Group Two'> */}
        {/* <div className='five'>Page Two</div> */}
        {/* <AsyncChild measureAsync /> */}
        {/* <div className='one'>Page Two - with margins</div> */}
        {/* <AsyncChild measureAsync /> */}
        {/* <div className='three'>Page Two</div> */}
        {/* <AsyncChild measureAsync /> */}
        {/* <AsyncChild measureAsync /> */}
        {/* <Grouper groupEvery={4}>
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
            <div>M</div>
            <div>O</div>
          </Grouper> */}
        {/* <div className='four'>Page Two</div> */}
        {/* </PageGroup> */}
        {/* <PageGroup name='Group Three'>
          <div className='three'>Page Three</div>
          <div className='two'>Page Three</div>
          <div className='five'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='four'>Page Three</div>
          <div className='one'>Page Three - with margins</div>
        </PageGroup> */}
      </ReportProvider>
    </div>
  );
}

export default App;
