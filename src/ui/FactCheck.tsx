import "./App.css"
import { useAiCallResponse } from "./AiCallResponseContext";

function FactCheck() {
  const { response } = useAiCallResponse();
  return (
    <>
      <h2 className="text-2xl font-bold">Fact-Check</h2>
      <p>Warning articles based on recent information may not be </p>
      <p>{response}</p>
    </>
  )
}

export default FactCheck;
