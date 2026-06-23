import { useState } from 'react'
import EditorMainPage from "./components/EditorMainPage";
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
            <EditorMainPage />
          </MetadataProvider>
        </CurrentFileProvider>
      </BrowserRouter>
    </>
  )
}

export default App
