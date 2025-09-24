import "./App.css"
import { useAiCallResponse } from "./AiCallResponseContext";
import { useNavigate } from "react-router-dom";

function Summary() {
  const { response } = useAiCallResponse();
  const navigate = useNavigate();
  return (
    <>
      <h2 className="text-2xl font-bold">Summary</h2>
      <p>{response}</p>
      <button onClick={() => navigate("/")}>Go Back</button>
    </>
  )
}

export default Summary;
