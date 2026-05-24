import React from 'react';

function MinimalApp() {
  return (
    <div style={{ padding: '50px', fontSize: '24px', color: 'black', backgroundColor: 'lightblue', minHeight: '100vh' }}>
      <h1>Minimal App - Test</h1>
      <p>This should render if React is working at all.</p>
      <p>Current timestamp: {new Date().toISOString()}</p>
    </div>
  );
}

export default MinimalApp;
