import { useState } from 'react'
import MainPage from "./components/MainPage";
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
            <MainPage />
          </MetadataProvider>
        </CurrentFileProvider>
      </BrowserRouter>
    </>
  )
}

export default App
