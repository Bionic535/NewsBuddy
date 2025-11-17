import "./App.css"
import { useAiCallResponse } from "./AiCallResponseContext";
import { useNavigate } from "react-router-dom";

function Summary() {
  const { response } = useAiCallResponse();
  const navigate = useNavigate();
  return (
    <>
      <h2 className="text-2xl font-bold">Summary</h2>
      <p className="border-2 rounded-md m-3 p-2">{response}</p>
      <button onClick={() => navigate("/")} className="border rounded-md">Go Back</button>
    </>
  )
}

export default Summary;
