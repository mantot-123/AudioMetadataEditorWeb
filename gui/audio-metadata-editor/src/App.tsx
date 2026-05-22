import { useState } from 'react'
import EditorMain from "./components/EditorMain";
import './App.css'
import CurrentFileProvider from './context/CurrentFileContext';
import MetadataProvider from "./context/MetadataContext";
import { BrowserRouter } from 'react-router';

function App() {
  return (
    <>
      <BrowserRouter>
        <CurrentFileProvider>
          <MetadataProvider>
            <EditorMain />
          </MetadataProvider>
        </CurrentFileProvider>
      </BrowserRouter>
    </>
  )
}

export default App
