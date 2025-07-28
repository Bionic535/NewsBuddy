import "./App.css"
import { useState } from "react"


function MyForm() {
  const [articleLink, setArticleLink] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Article Link Submitted:", articleLink);
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
