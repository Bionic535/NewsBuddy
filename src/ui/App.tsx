import { useEffect } from 'react';
import './App.css'
import MyForm from './form'
import Summary from './summary'
import FactCheck from './FactCheck';
import { Settings } from './Settings';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
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

    const removeLogListener = window.electronAPI.onLog((message: any) => {
      console.log('From main process:', message);
    });

    return () => {
      removeSummaryListener();
      removeFactCheckListener();
      removeLogListener();
    };
  }, [navigate, setResponse]);

  return (
    <>
      <nav>
        <Link to="/">Home</Link> | <Link to="/settings">Set API Key</Link>
      </nav>
      <h1 className="text-4xl font-bold mb-4">NewsBuddy</h1>
      <Routes>
        <Route path="/" element={<MyForm />} />
        <Route path="/summary" element={<Summary />} />
        <Route path="/factcheck" element={<FactCheck />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}

export default App
