// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import UserProfile from './components/UserProfile';
import { useEffect, useState } from 'react';

function HomePage() {
  const [ping, setPing] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/ping')
      .then(res => res.json())
      .then(data => setPing(data.message))
      .catch(() => setPing('Failed ❌'));
  }, []);

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h1>Ping Test</h1>
      <p>Server says: {ping}</p>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/profile" element={<UserProfile />} />
        </Route>
      </Routes>
    </Router>
  );
}


