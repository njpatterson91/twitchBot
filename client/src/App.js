import { useState, useEffect } from "react";
import "./App.css";
import Axios from "axios";
function App() {
  const [emojis, setEmojis] = useState([]);
  useEffect(() => {
    Axios.get(`http://localhost:5000/emotes`)
      .then((res) => {
        console.log(res.data);
        setEmojis(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div>
      <header>
        <h1>DXS Bot</h1>
        {emojis.map((item) => (
          <p>{item.emote}</p>
        ))}
      </header>
    </div>
  );
}

export default App;
