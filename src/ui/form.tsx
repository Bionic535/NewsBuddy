import "./App.css"
import { useState } from "react"

// Define the source type based on Electron's DesktopCapturerSource
interface Source {
  id: string;
  name: string;
}

function MyForm() {
  const [articleLink, setArticleLink] = useState("");
  const [sources] = useState<Source[]>([]);

  
  return (
    <>
      <form onSubmit={() => console.log("Submitted")}>
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

      <div className="mt-4">
        <button type="button" className="border p-2" onClick={() => console.log("Get Sources Clicked")}>
          Get Available Capture Sources
        </button>
        <h3 className="mt-2">Available Sources:</h3>
        <ul>
          {sources.map(source => (
            <li key={source.id}>{source.name}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default MyForm
