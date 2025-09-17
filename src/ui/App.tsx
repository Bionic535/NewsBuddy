import './App.css'
import MyForm from './form'
import Summary from './summary'
import FactCheck from './FactCheck';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import { AiCallResponseProvider } from './AiCallResponseContext'

function App() {

  return (
    <>
      <AiCallResponseProvider>
      <h1 className="text-4xl font-bold">NewsBuddy</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MyForm />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/factcheck" element={<FactCheck />} />
        </Routes>
      </BrowserRouter>
      </AiCallResponseProvider>
    </>
  )
}

export default App
