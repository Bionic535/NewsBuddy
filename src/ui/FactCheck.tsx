import "./App.css"
import { useAiCallResponse } from "./AiCallResponseContext";
import { useNavigate } from "react-router-dom";
function FactCheck() {
  const { response } = useAiCallResponse();
  const navigate = useNavigate();
  return (
    <>
      <h2 className="text-2xl font-bold">Fact-Check</h2>
      <p>Warning articles based on recent information may not be </p>
      <p>{response}</p>
      <button onClick={() => navigate("/")}>Go Back</button>
    </>
  )
}

export default FactCheck;
