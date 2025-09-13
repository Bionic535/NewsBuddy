import "./App.css"
import { useAiCallResponse } from "./AiCallResponseContext";

function Summary() {
  const { response } = useAiCallResponse();
  return (
    <>
      <h2 className="text-2xl font-bold">Summary</h2>
      <p>{response}</p>
    </>
  )
}

export default Summary;
