import "./App.css"
import { useState } from "react"
import { useNavigate } from "react-router-dom";

// Define the source type based on Electron's DesktopCapturerSource


function MyForm() {
  const [articleLink, setArticleLink] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitted");
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
