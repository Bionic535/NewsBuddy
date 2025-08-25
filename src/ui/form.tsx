import "./App.css"
import { useState } from "react"


function MyForm() {
  const [articleLink, setArticleLink] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await window.electron.ai_call("S", articleLink);
    if (result) {
      console.log("AI Call Result:", result.output_text);
    }
    else {
      console.error("AI Call failed or returned no result.");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Enter the article link:
          <input
            className = "border"
            type="text"
            value={articleLink}
            onChange={(event) => setArticleLink(event.target.value)}
          />
        </label>
      </div>
      <div>
        <input className = "border" type="submit" value="Submit" />
      </div>
    </form>
  )
}

export default MyForm
