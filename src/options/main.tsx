import ReactDOM from "react-dom/client"

function Options() {
  return (
    <div className="p-6 text-gray-900 font-sans">
      <h1 className="text-2xl font-bold mb-4">SendShield Settings</h1>
      <label className="block">
        Delay time:
        <select className="ml-2 border rounded px-2 py-1">
          <option>15s</option>
          <option>30s</option>
          <option selected>60s</option>
          <option>2min</option>
        </select>
      </label>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root")!).render(<Options />)
