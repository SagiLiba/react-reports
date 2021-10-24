import './App.scss';
import { PagesSplit } from './Components/PagesSplit/PagesSplit';
import { Page } from './Components/Page/Page';
import { ReportContextProvider } from './Contexts/ReportContext';
import { TableOfContents } from './Components/TableOfContents/TableOfContents';

function App() {
  return (
    <div className='App'>
      <ReportContextProvider>
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
