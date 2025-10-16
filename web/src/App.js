import { useEffect } from "react";

// Create a small test call from React to confirm the frontend can reach the backend.
function App() {
  useEffect(() => {
    const API_BASE_URL = process.env.REACT_APP_API_URL;
    fetch(`${API_BASE_URL}/accounts/health/`)
      .then(res => res.json())
      .then(data => console.log("API connected:", data))
      .catch(err => console.error("API error:", err));
  }, []);

  return <h1>CardSense Frontend Connected</h1>;
}

export default App;
