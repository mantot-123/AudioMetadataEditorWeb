import { useState } from 'react'
import EditorMain from "./components/EditorMain";
import './App.css'
import CurrentFileProvider from './context/CurrentFileContext';
import { BrowserRouter } from 'react-router';

function App() {
  return (
    <>
      <BrowserRouter>
        <CurrentFileProvider>
          <EditorMain />
        </CurrentFileProvider>
      </BrowserRouter>
    </>
  )
}

export default App
