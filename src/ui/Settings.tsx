import { useState, useEffect } from 'react';

export function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect (() => {
    const fetchApiKey = async () => {
      const storedApiKey = await window.electronAPI.getApiKey();
      if (storedApiKey) {
        setApiKey(storedApiKey);
      }
    };
    fetchApiKey();
  }, []);

  const handleSave = () => {
    window.electronAPI.setApiKey(apiKey);
  };

  return (
    <div>
      <div>
        <label htmlFor="apiKey" className="text-2xl font-bold">OpenAI API Key:</label>
        <input
          className="border rounded-md outline-1.5 font-bold p-2"
          id="apiKey"
          type={showApiKey ? 'text' : 'password'}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button onClick={() => setShowApiKey(!showApiKey)} className='border font-bold'>
          {showApiKey ? 'Hide' : 'Show'}
        </button>
      </div>
      <button onClick={handleSave} className='border font-bold'>Save</button>
    </div>
  );
}

