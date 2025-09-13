import "./App.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { useAiCallResponse } from "./AiCallResponseContext";

// Define the source type based on Electron's DesktopCapturerSource


function MyForm() {
  const [articleLink, setArticleLink] = useState("");
  const navigate = useNavigate();
  const { setResponse } = useAiCallResponse();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitted");
    const result = await window.electronAPI.aiCall(articleLink, "summarize");
    console.log(result);
    if (result) {
      setResponse(result.output_text);
    }
    else {
      setResponse("Error: No response from AI");
    }
    navigate("/summary");
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
          <input className="border" type="submit" value="Submit" />
        </div>
      </form>

      
    </>
  )
}

export default MyForm
