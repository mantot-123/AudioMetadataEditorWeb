import MainPage from "./pages/MainPage";
import './App.scss'
import CurrentFileProvider from './context/CurrentFileContext';
import TagFormProvider from './context/TagFormContext';
import { BrowserRouter } from 'react-router';
import SidebarProvider from "./context/SidebarContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <CurrentFileProvider>
          <TagFormProvider>
            <SidebarProvider>
              <MainPage />
            </SidebarProvider>
          </TagFormProvider>
        </CurrentFileProvider>
      </BrowserRouter>
    </>
  )
}

export default App
