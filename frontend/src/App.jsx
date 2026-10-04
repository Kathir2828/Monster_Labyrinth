import { useState } from 'react'
import HomePage from './pages/HomePage'
import DungeonPage from './pages/DungeonPage'
import GraphTraversal from './pages/GraphTraversal';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/dungeon' element={<DungeonPage />} />
          <Route path='/graph-traversal' element={<GraphTraversal />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
