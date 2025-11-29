import React, { useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function History() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = React.useState([]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/history/get?user_id=${user.id}`
      );
      setHistory(res.data);
    };

    load();
  }, [user]);

  return (
    <div className="container">
      <h1>Your API History</h1>

      {!history.length && <p>No history yet.</p>}

      {history.map((item, index) => (
        <div className="history-card" key={index}>
          <p><strong>URL:</strong> {item.url}</p>
          <p><strong>Method:</strong> {item.method}</p>
          <p><strong>Time:</strong> {item.time}</p>
        </div>
      ))}
    </div>
  );
}

export default History;
