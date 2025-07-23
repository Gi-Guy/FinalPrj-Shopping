import React, { useEffect, useState } from 'react';
import { AppRouter } from './router';

function App() {
  const [, setPing] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/ping')
      .then(res => res.json())
      .then(data => setPing(data.message))
      .catch(() => setPing('Failed ❌'));
  }, []);

  return (
    <>
      <AppRouter />
    </>
  );
}

export default App;
