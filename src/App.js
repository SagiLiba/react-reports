import './App.scss';
import { PagesSplit } from './Components/PagesSplit/PagesSplit';
import { Page } from './Components/Page/Page';
import { ReportContextProvider } from './Contexts/ReportContext';

function App() {
  return (
    <div className='App'>
      <ReportContextProvider>
        <PagesSplit>
          <div className='one'>Text</div>
          <div className='two'>Text</div>
          <div className='three'>Text</div>
          <div className='four'>Text</div>
          <div className='five'>Text</div>
        </PagesSplit>
      </ReportContextProvider>
    </div>
  );
}

export default App;
