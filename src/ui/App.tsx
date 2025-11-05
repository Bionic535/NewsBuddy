import { useEffect } from 'react';
import './App.css'
import MyForm from './form'
import Summary from './summary'
import FactCheck from './FactCheck';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAiCallResponse } from './AiCallResponseContext';

function App() {
  const { setResponse } = useAiCallResponse();
  const navigate = useNavigate();

  useEffect(() => {
    const removeSummaryListener = window.electronAPI.onScreenshotTakenSummary((result: any) => {
      console.log('Screenshot taken in renderer:', result);
      setResponse(result);
      navigate("/summary");
    });

    const removeFactCheckListener = window.electronAPI.onScreenshotTakenFactCheck((result: any) => {
      console.log('Fact-check Screenshot taken in renderer:', result);
      setResponse(result);
      navigate("/factcheck");
    });

    return () => {
      removeSummaryListener();
      removeFactCheckListener();
    };
  }, [navigate, setResponse]);

  return (
    <>
      <h1 className="text-4xl font-bold">NewsBuddy</h1>
      <Routes>
        <Route path="/" element={<MyForm />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/factcheck" element={<FactCheck />} />
      </Routes>
    </>
  );
}

export default App
