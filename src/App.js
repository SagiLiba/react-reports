import './App.scss';
import { PagesSplit } from './Components/PagesSplit/PagesSplit';
import { Page } from './Components/Page/Page';
import { ReportContextProvider } from './Contexts/ReportContext';

function App() {
  return (
    <div className='App'>
      <ReportContextProvider>
        <PagesSplit delayed={1000}>
          <div className='one'>Text</div>
          <div className='two'>Text</div>
        </PagesSplit>
        <PagesSplit delayed={300}>
          <div className='four'>Text</div>
          <div className='one'>Text</div>
          <div className='five'>Text</div>
          <div className='three'>Text</div>
        </PagesSplit>
        <PagesSplit delayed={100}>
          <div className='three'>Text</div>
          <div className='two'>Text</div>
          <div className='five'>Text</div>
          <div className='four'>Text</div>
          <div className='four'>Text</div>
          <div className='four'>Text</div>
          <div className='four'>Text</div>
          <div className='four'>Text</div>
          <div className='one'>Text</div>
        </PagesSplit>
      </ReportContextProvider>
    </div>
  );
}

export default App;
