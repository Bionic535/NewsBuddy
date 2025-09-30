import { useEffect } from 'react';
import './App.css'
import MyForm from './form'
import Summary from './summary'
import FactCheck from './FactCheck';
import { Routes,Route } from 'react-router-dom';
import { useAiCallResponse } from './AiCallResponseContext';
import { useNavigate } from 'react-router-dom';
function App() {
  const { setResponse } = useAiCallResponse(); 
  const navigate = useNavigate();
  [navigate]
  useEffect(() => {
    const removeListener = window.electronAPI.onScreenshotTaken((result: any) => {
      console.log('Screenshot taken in renderer:', result);
      setResponse(result);
      navigate("/summary")

      // You can now update your React state with this result
    });

    // Cleanup on component unmount
    return () => {
      removeListener();
    };
  }, []); // Empty array ensures this runs only once

  return (
    <>
      <h1 className="text-4xl font-bold">NewsBuddy</h1>
        <Routes>
          <Route path="/" element={<MyForm />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/factcheck" element={<FactCheck />} />
        </Routes>
    </>
  )
}

export default App
