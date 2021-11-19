# React-Reports

## _Generate Pixel-Perfect Print Ready A4 Documents That Are Easily Convertable Into PDFs

react-reports is a library meant to help you generate print-ready reports
that will bring immediate value to you customers.

- It creates A4 documents that are ready for print.
- Easy conversion to PDF using Puppeteer, Selenium, etc..

## Features

- Automatic table of contents.
- Automatic page splitting.
- Built-in async support.
- Built-in API integration.

## Installation

Easy to install:

```
yarn add react-reports
-------------------------
npm install react-reports
```

## Usage Example:

The following example will use the `PageGroup` component to split your elements into multiple pages:

```
function App() {
  return (
    <div className='App'>
      <ReportProvider>
        <TableOfContents />
        <PageGroup name='Automatic Page Split'>
          <div style={{ height: '300px', width: '100%', background: 'red' }}>One</div>
          <div style={{ height: '700px', width: '100%', background: 'blue' }}>Two</div>
          <div style={{ height: '500px', width: '100%', background: 'yellow' }}>Three</div>
          <div style={{ height: '200px', width: '100%', background: 'green' }}>Four</div>
        </PageGroup>
      </ReportProvider>
    </div>
  );
}

export default App;
```
Breakdown:
- You must wrap your report with the context `ReportProvider`.
- It will split the component into two different pages.
- Page one includes the "One" and "Two" divs.
- Page two includes the "three" and "four" divs.
- Table of contents is generated automatically using the `TableOfContents` component.


### `Note:`

The library is still in beta, current pitfalls:

- You cannot have text as a direct child of the `PageGroup` component, it will crash the report. To property add text, wrap it inside a DOM element.


## Component API

### ReportProvider

```
<ReportProvider config={YourConfigObject}>
```


The report provider stores all the relevant logic needed to generate the report.
It receives a config object that has the following properties:


| Property      | Usage                                                                                                            |                                                                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| initialValues | Accepts an array of objects { putOnProp: string, value: any }                                                    | Data can be accessed using the useReport() Hook.                                                                                                                                            |
|               | putOnProp                                                                                                        | set the property the initial value will be set on                                                                                                                                           |
|               | value                                                                                                            | The value being set on the putOnProp property                                                                                                                                               |
| apis          | Accepts an array of objects { request: Promise, processingFunction: (response) => response), putOnProp: string } | Data can be accessed using the useReport() Hook.                                                                                                                                            |
|               | request                                                                                                          | Pass the promise you wish to call                                                                                                                                                           |
|               | processingFunction                                                                                               | Process the promise response before the values are being set in the context                                                                                                                 |
|               | putOnProp                                                                                                        | set the property the processed response will be set on                                                                                                                                      |
| loader        | Override default loader, { text: string, component: Reference to a component}                                    | Default loader displays: "Generating Report"                                                                                                                                                |
|               | text                                                                                                             | Override the default loader text                                                                                                                                                            |
|               | component                                                                                                        | Replace the loader with your own custom loader                                                                                                                                              |
| header        | Override default page header, { display: boolean, component: Reference to a component, height: number }          | Each page has a default header, you can override it with a custom header using this property.                                                                                               |
|               | display                                                                                                          | Show / Hide the header.                                                                                                                                                                     |
|               | component: ({pageName,pageNumber,headerClass }) => Component                                                     | Pass a reference to custom header component, your component will be injected with the props: "pageName" and "pageNumber", you can style the default header using the "headerClass".         |
|               | height                                                                                                           | Currently the height of the header must be pre-calculated by the developer, please set the height of the component including padding, margins and border, to correctly calculate the pages. |
| footer        | Override default page footer, { display: boolean, component: Reference to a component, height: number }          | Each page has a default footer, you can override it with a custom footer using this property.                                                                                               |
|               | display                                                                                                          | Show / Hide the footer.                                                                                                                                                                     |
|               | component: ({pageName,pageNumber,footerClass}) => Component                                                      | Pass a reference to custom footer component, your component will be injected with the props: "pageName" and "pageNumber", you can style the default footer using the "footerClass".         |
|               | height                                                                                                           | Currently the height of the footer must be pre-calculated by the developer, please set the height of the component including padding, margins and border, to correctly calculate the pages. |

## useReport()

The report initial values and apis being set in the config could be accessed by your components
using the useReport() hook.
| Property | Usage |
| ------ | ------ |
| initial | All the initial values passed here will be put on an object with the relevant property names you've passed to "putOnProp" property and their matching values.
| requests | All the apis you've set, after being called and processed will have their responses set here, they will be using the "putOnProp" property
| rejectedRequests | All apis that were rejected will have their error set here under the relevant "putOnProp" property |

> The initial values and apis you set will be called before all report page processing is started, this means the report waits for all the requests to return a response until it starts working on your report.

## PageGroup

The core component of the library, in charge of creating the pages based on the height of your components.

- The component has several rendering phases it takes to render your pages for print.
- It will first measure all the direct children heights during the "MEASURE" phase.
- it will then calculate the pages based on their heights and including your usage of the "header", footer and "repeating" component as described below, during the "SPLIT_TO_PAGES" phase.
- It will then reach the "PAGES_READY" phase and render your pages.
  > Different phase will render your components FROM SCRATCH.

| Property  | Usage                                                                                                                                                                                                                                                                                                                                   |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name      | Pass the name that will be injected to the header and footer components.                                                                                                                                                                                                                                                                |
| maxPages  | Limit the number of pages the PageGroup generates, when dealing with a large amount of data such as displayed tables, you might decide to only display the first 2 pages instead of dozens of pages it is going to generate.                                                                                                            |
| repeating | { top: { component: Reference to component, height: number }, bottom: { component: Reference to component, height: number } }, each page can have repeating component that will be displayed at the top and bottom of each page being created, could be useful for tables, when you wish to have the table header appear at every page. |

### Usage:

```
// Usage of repeating components of the PageGroup:
const repeatingComponents = {
  top: {
    component: CustomRepeatingTop,
    height: 50,
  },
  bottom: {
    component: CustomRepeatingBottom,
    height: 50,
  },
}
<ReportProvider>
    <PageGroup name='Automatic Page Split' maxPages={5} repeating={repeatingComponents}>
      <div style={{ height: '300px', width: '100%', background: 'red' }}>One</div>
      <div style={{ height: '700px', width: '100%', background: 'blue' }}>Two</div>
      <div style={{ height: '500px', width: '100%', background: 'yellow' }}>Three</div>
      <div style={{ height: '200px', width: '100%', background: 'green' }}>Four</div>
    </PageGroup>
</ReportProvider>
```

## Table Of Contents

A Component that automatically generates a table of contents based on the `PageGroup` components you've used.
Currently, single pages will be left out of the table of contents.

The table of contents will have links generated directing you to the relevant page.

```
<TableOfContents />
```

This component will not split into multiple pages, if such functionality is needed use the `PageGroup` component instead.

## Asynchronous behavior

The library prefers that all your async API operations will be dealt with by passing
the relevant Promises to the "apis" config property, and then accesing their values by using
the useReport() hook.

This makes sure that the page calculation will be based on the actual space your component takes out of the page.
Sometimes you will still have component that will finish their rendering after an async operation of unknown time.
To allow for asynchronous behavior, I'm delayed the "MEASURE" phase in the `PageGroup` component, that is until
you specifically notify the height of your elements when they are rendered to the screen, and you must also save
their state using the provided functions.

#### measureAsync

The `PageGroup` component detects a direct child with the "measureAsync" property and injects relevant
properties to handle the async operations.

A direct child meaning a child of `PageGroup`:

```
<PageGroup name='Group One' repeating={PageGroupRepeating}>
  <div className='one'>Page One - with margins</div>
  <AsyncChild measureAsync /> // Asynchronous DIRECT child
  <div style={{ height: '700px', width: '100%', background: 'blue' }}>Two</div>
 </PageGroup>
```

The "measureAsync" property will inject into your custom child component the following properties:

| Property       | Usage                                                                                                                                                                |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \_notifyHeight | After your async operations are complete use this function to notify the `PageGroup` of your component height, page generation will not proceed until this is done. |
| \_saveState    | In order to avoid duplicate async operations, save any of your component state using this function.                                                                  |
| \_savedState   | Any state saved will be available for your async component later.                                                                                                    |

> When the report is generating the page between the "MEASURE" phase and "PAGES_READY" phase, ENTIRELY new children are created causing async children to mount again from scratch, to avoid these issues, use the \_saveState and \_savedState properties.

### Usage:

```
export const AsyncChild = ({ _notifyHeight, _saveState, _savedState }) => {
  const [texts, setTexts] = useState(_savedState ? _savedState.texts : []);
  const asyncElement = useRef();
  const timeoutId = useRef();

  // Async loading data
  useEffect(() => {
   // Simple async operation, mimicking an API request fetching texts.
    timeoutId.current = setTimeout(() => {
      setTexts(['Async text one', 'Async text two', 'Äsync text three']);
    }, 2000);

    // Cleaning up after the our setTimeout operation incase this component is re-rendered .
    // This avoids the error of: You are trying to set the state of an unmounted component.
    return () => {
      clearTimeout(timeoutId.current);
    };
  }, []);

  useEffect(() => {
    // 1 - You must notify the height of the child only after it has rendered all
    //     of its async behavior, APIs, images, text, etc...
    // 2 - You must also save your async information using _saveState to avoid recalling the state
           in the next child creation (between phases).
    // If our fetched texts are available and we have nothing in the _savedState property,
    // Notify the height of the component, and save its state once.
    if (texts.length > 0 && !_savedState) {
    // Use the measureHeight function to get the correct height of your elements.
      _notifyHeight && _notifyHeight(measureHeight(asyncElement.current));
      _saveState &&
        _saveState({
          texts,
        });
    }
  });

  return (
    // Use Overflow auto for correct height calcualtions
    // Referencing it will return an element with correct height.
    <OverflowAuto ref={asyncElement}>
      <div className={'async-text'}>
        {texts.map((text, index) => {
          return (
            <h2 key={index}>
              {index + 1}. {text}
            </h2>
          );
        })}
      </div>
    </OverflowAuto>
  );
};
```

#### measureHeight

Use the measureHeight to correctly measure your elements height, and notify the `PageGroup`
Pass it a refernce to a DOM element.

#### OverflowAuto

To make sure that the height is being calculated correctly use the `OverflowAuto` component
to wrap you child with a div with "overflow: auto", this makes sure that your child component
will help correct height measurements of margins,padding and border.

You must pass a reference using "useRef" to access that childs height and notify the `PageGroup`.

#### Summary of Asynchronous Behavior

By Combining all of the above `AsyncMeasure`, `measureHeight`, `OverflowAuto`, `_notifyHeight`, `_saveState`, and `_savedState` you have complete control over asynchronous operation allowing you to generate the report pages with async components.

> Remember that `asyncMeasure` is only available as a direct child of the `PageGroup` component.

### AsyncImage

To correctly calculate the height of remote images I've created the AsyncImage component,
It implements all the above asynchronous behavior I've mentioned, and must be used as a direct
child of the <PageGroup/> component.

#### Usage:

```
  <AsyncImage
    measureAsync
    url='https://media-cdn.tripadvisor.com/media/photo-s/1a/86/7c/6d/img-src-x-onerror-alert.jpg'
    imageProps={{ alt: 'Alt tag' }}
  />
```

`Breakdown:`

- Again `measureAsync` is used to indicate that we are dealing with an async child.
- A remote image is being loaded using the `url` property.
- You can pass additional props to the `img` element using `imageProps`.

You can use regular images when you are sure they have already been loaded in memory, or by hard-coding them.
That is without using the `AsyncImage` component.

```
<img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA.....'/>
```

## PageSize

The PageSize enum holds the suppored page size, and is accessible to import.
Currently only A4 documents are supported and the size is 793X1120.
This size is used to split the component into different pages based on their heights.

## Generating a PDF from the report

Some of the magic of the react-reports library is by how easy it is
to create a pdf file with the generated report.

When the report is ready for print / pdf generation it will add the following
element to the DOM, allowing your chosen library to create the PDF file once it appears:

`<div id="rr-ready-for-print"></div>`

### Example using Puppeteer:

Puppeteer is using NodeJS, if you are unfamiliar with it, it is a head-less browser,
meaning it runs a Chromium based browser on your machine, allowing you full control
over its opeartions.

Here it will be used to generate a PDF file.

Save the following file under index.js, and use this command:

```
node index.js <Application route of the report> <optionalPathToFile><fileName.pdf> <DOM element to wait for>
Usage:
node index.js http://localhost:3000/pathToReport file.pdf "#rr-ready-for-print"
```

```
const puppeteer = require('puppeteer');

(async () => {
 // Accepts command line arguments to generate the report:
  const userArgs = process.argv.slice(2);
  const location = userArgs[0];
  const path = userArgs[1];
  const waitForSelector = userArgs[2];

  const browser = await puppeteer.launch({
    //If you are using a self-signed certificate, you can ignore it using this property.
    ignoreHTTPSErrors: true,
    headless: true,
  });

  try {
    const page = await browser.newPage();

    // Set the browser viewport.
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    });

    // Enter your report at the relevent page,
    // Use all available page loaded events to make sure all components have been rendered.
    await page.goto(location, { waitUntil: ['load', 'domcontentloaded', 'networkidle0', 'networkidle2'] });

    // Wait for '#rr-ready-for-print' element to appear,
    // Indicating that the report is ready for print/PDF generation.
    await page.waitFor(waitForSelector, { timeout: 600000, visible: true });
    await page.emulateMediaType('print');

    // Using a safe buffer to letting any rendering that occurs to finish,
    // even though it should be ready.
    await page.waitFor(400);

    // Create a path and save to the relevant path:
    await page.pdf({ path: path, format: 'A4' });

    // PDF was saved close the head-less broswer.
    await browser.close();

  } catch (e) {
    console.log('Found Error:' ,e);
    browser.close();
  }
})();

```