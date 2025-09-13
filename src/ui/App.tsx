import './App.css'
import MyForm from './form'
import Summary from './summary'
import { BrowserRouter,Routes,Route } from 'react-router-dom';
function App() {

  return (
    <>
      <h1 className="text-4xl font-bold">NewsBuddy</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MyForm />} />
          <Route path="/summary" element={<Summary />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
