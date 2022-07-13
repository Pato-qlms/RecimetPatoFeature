import React from 'react';
import { GeneralProvider } from './contexts/GeneralContext';
import { QueueProvider } from './contexts/QueueContext';
import MainComponent from './components/MainComponent';

//___________________________________________________________________________________
const App = () => {
  return (
    <GeneralProvider>
      <QueueProvider>
        <MainComponent />
      </QueueProvider>
    </GeneralProvider>
  );
};

//___________________________________________________________________________________
export default App;
