import "./App.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAiCallResponse } from "./AiCallResponseContext";

// Define the source type based on Electron's DesktopCapturerSource


function MyForm() {
  const [articleLink, setArticleLink] = useState("");
  const [action, setAction] = useState("summarize");
  const navigate = useNavigate();
  const { setResponse } = useAiCallResponse();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitted");
    const result = await window.electronAPI.aiCall(articleLink, action);
    console.log(result);
    if (result) {
      setResponse(result.output_text);
    }
    else {
      setResponse("Error: No response from AI");
    }
    if (action === "summarize") {
      navigate("/summary");
    } else if (action === "fact-check") {
      navigate("/factcheck");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <div className="mb-3">
            <label className="text-2xl font-bold">Article Link:</label>
              <input
                className="border rounded-md outline-1.5 font-bold"
                type="text"
                value={articleLink}
                onChange={(event) => setArticleLink(event.target.value)}
              />
            
          </div>
          <div>
            <label className="text-2xl font-bold">Summarize or Fact-Check:</label>
            <select 
              className="border outline-1.5 font-bold"
              id="action"
              name="action"
              value={action}
              onChange={(event) => setAction(event.target.value)}
            >
              <option value="summarize">Summarize</option>
              <option value="fact-check">Fact-Check</option>
            </select>
          </div>
        </div>
        <div>
          <input className="border mb-2 font-bold" type="submit" value="Submit" />
        </div>
        <div>
          {action === "fact-check" ? <p className="font-bold">I can only fact check using data up until October 2024.</p> : <p></p>}
        </div>
      </form>
      <p className="font-bold">Press Ctrl/Cmd + shift + s to summarize an article you have open or Ctrl/Cmd + shift + c to fact check it</p>

      
    </>
  )
}

export default MyForm
