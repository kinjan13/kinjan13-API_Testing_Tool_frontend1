import React, { useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function History() {
  const { user } = useContext(AuthContext);
  const [history, setHistory] = React.useState([]);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const res = await axios.get(`/history/get?user_id=${user.id}`);
        const data = res.data;

        if (data?.error) {
          console.error("History load error:", data.message || data);
          setHistory([]);
          return;
        }

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.history)
          ? data.history
          : [];

        setHistory(list);
      } catch (err) {
        console.error("Failed to load history:", err);
        setHistory([]);
      }
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
