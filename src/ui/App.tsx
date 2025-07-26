import './App.css'

function App() {

  return (
    <>
      <h1 className="text-4xl font-bold">NewsBuddy</h1>
      <div>
        <form>
          <input type="text" placeholder="Article Link Here" />
          <div>
            <button type="submit">Go</button>
          </div>
        </form>
      </div>
      <p>
        Ctrl + S for summary | Ctrl + C to Check the Article
      </p>
    </>
  )
}

export default App
