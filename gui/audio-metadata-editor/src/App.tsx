import MainPage from "./pages/MainPage";
import './App.css'
import CurrentFileProvider from './context/CurrentFileContext';
import TagFormProvider from './context/TagFormContext';
import { BrowserRouter } from 'react-router';

function App() {
  return (
    <>
      <BrowserRouter>
        <CurrentFileProvider>
          <TagFormProvider>
            <MainPage />
          </TagFormProvider>
        </CurrentFileProvider>
      </BrowserRouter>
    </>
  )
}

export default App
