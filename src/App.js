import React from 'react';
import './App.scss';
import { AsyncChild } from './Components/AsyncChild/AsyncChild';
import { AsyncImage } from './Components/AsyncImage/AsyncImage';
import { Grouper } from './Components/Grouper/Grouper';
import { PageGroup } from './Components/PageGroup/PageGroup';
import { TableOfContents } from './Components/TableOfContents/TableOfContents';
import { ReportProvider } from './Contexts/ReportContext';
import { ToBottom } from './Functions';
import { Page } from './Components/Page/Page';
import { Text } from './Components/Text/Text';

const promiseOne = new Promise((resolve) =>
  resolve({ status: true, data: ['one', 'two', 'three'] })
);
const promiseTwo = new Promise((resolve) =>
  resolve({ status: true, data: ['four', 'five', 'six'] })
);
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
      <div className="custom-footer">
        Footer - {pageName} - {pageNumber}
      </div>
    </ToBottom>
  );
};

const CustomHeader = ({ pageName = '', pageNumber = '' }) => {
  return (
    <div className="custom-header">
      Header - {pageName} - {pageNumber}
    </div>
  );
};

const CustomHeaderTwo = ({ pageName = '', pageNumber = '' }) => {
  return (
    <div className="custom-header" style={{ background: 'red' }}>
      Header - {pageName} - {pageNumber}
    </div>
  );
};

const CustomFooterTwo = ({ pageName = '', pageNumber = '' }) => {
  return (
    <ToBottom>
      <div className="custom-footer" style={{ background: 'blue' }}>
        Footer - {pageName} - {pageNumber}
      </div>
    </ToBottom>
  );
};

const CustomLoader = () => {
  return <div className="custom-loader">Load</div>;
};

const reportConfig = {
  initialValues: [
    { putOnProp: 'four', value: { someAPI: 'Four Values' } },
    { putOnProp: 'five', value: { someAPI: 'Five Values' } },
  ],
  apis: [
    {
      request: promiseOne,
      processingFunction: (response) => response.data,
      putOnProp: 'one',
    },
    {
      request: promiseTwo,
      processingFunction: (response) => response.data,
      putOnProp: 'two',
    },
    {
      request: promiseThree,
      processingFunction: (response) => response.data,
      putOnProp: 'three',
    },
  ],
  loader: {
    // text: 'Generating Report, Please wait...',
    // component: CustomLoader, // takes precedence over the text property.
  },
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

const customHeader = {
  display: true,
  component: CustomHeaderTwo,
  height: 168,
};

const customFooter = {
  display: true,
  component: CustomFooterTwo,
  height: 168,
};

const texts = [
  <Text>
    sagi sagi sagi sagi sagi sagi sagi sagi sagi sagi sagi sagi sagi sagi sagi
    sagi sagi sagi sagi sagi sagi sagi sagi sagi sagi sagi sagi sagi
  </Text>,
  <Text>
    liba liba liba liba liba liba liba liba liba liba liba liba liba liba liba
    liba liba liba liba liba liba liba liba liba liba liba liba liba liba liba
    liba liba liba liba liba liba liba liba liba
  </Text>,
];

const image = `data:image/png;base64,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`;
// :: Grouper and asyncMeasure are top level only, meaning a direct child of PageGroup

function App() {
  return (
    <div className="App">
      <ReportProvider config={reportConfig}>
        <TableOfContents />
        <PageGroup
          name="Group One"
          repeating={PageGroupRepeating}
          header={customHeader}
          footer={customFooter}
        >
          {texts}
          <div className="one">Page One - with margins</div>
          <img src={image} />
          <AsyncChild measureAsync />
          {/* <AsyncImage
            measureAsync
            url="https://media-cdn.tripadvisor.com/media/photo-s/1a/86/7c/6d/img-src-x-onerror-alert.jpg"
            imageProps={{ alt: 'Alt tag' }}
          />
          <AsyncChild measureAsync />
          <AsyncChild measureAsync />
          <div className="two">Page One</div>
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
          <div className="two">Page One</div>
          <div className="two">Page One</div> */}
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
        <PageGroup name="Group Three">
          <div className="three">Page Three</div>
          <div className="two">Page Three</div>
          <div className="five">Page Three</div>
          <div className="four">Page Three</div>
          <div className="four">Page Three</div>
          <div className="four">Page Three</div>
          <div className="four">Page Three</div>
          <div className="four">Page Three</div>
          <div className="one">Page Three - with margins</div>
        </PageGroup>
      </ReportProvider>
    </div>
  );
}

export default App;
