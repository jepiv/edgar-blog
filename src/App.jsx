import React from 'react';
import EDGARFiletypes from './components/EDGARFiletypes';
import SECFilingsViz from './components/SECFilingsViz';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="space-y-12">
        <SECFilingsViz />
        <EDGARFiletypes />
      </div>
    </div>
  );
}

export default App;
