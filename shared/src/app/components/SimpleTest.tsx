import React from 'react';

export function SimpleTest() {
  return (
    <div style={{ padding: '40px', background: '#eee', minHeight: '100vh' }}>
      <h1 style={{ color: '#000', fontSize: '32px', marginBottom: '20px' }}>
        Simple Test Component
      </h1>
      <p style={{ color: '#333', fontSize: '18px' }}>
        This is a minimal test to verify React rendering works.
      </p>
      <div style={{ marginTop: '20px', padding: '20px', background: '#fff', borderRadius: '8px' }}>
        <p>If you can see this box, React components are rendering correctly.</p>
      </div>
    </div>
  );
}
