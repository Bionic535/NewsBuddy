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
        <div>
          <label>Enter the article link:   
            <input
              className="border"
              type="text"
              value={articleLink}
              onChange={(event) => setArticleLink(event.target.value)}
            />
          </label>
        </div>
        <div>
          <label>Summarize or Fact-Check:   </label>
          <select 
            className="border"
            id = "action"
            name = "action"
            value = {action}
            onChange = {(event) => setAction(event.target.value)}
          >
            <option value="summarize">Summarize</option>
            <option value="fact-check">Fact-Check</option>
          </select>
        </div>
        
        <div>
          <input className="border" type="submit" value="Submit" />
        </div>
        <div>
          {action === "fact-check" ? <p>I can only fact check using data up until October 2024.</p> : <p></p>}
        </div>
      </form>
      <p>Press Ctrl/Cmd + shift + s to summarize an article you have open or Ctrl/Cmd + shift + c to fact check it</p>

      
    </>
  )
}

export default MyForm
