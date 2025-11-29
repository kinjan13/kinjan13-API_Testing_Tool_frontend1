import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function HistoryPanel({ history, setHistory }) {
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const res = await axios.get(
        `http://localhost:5000/history/get?user_id=${user.id}`
      );

      setHistory(res.data);
    };
    load();
  }, [user, setHistory]);
  const deleteItem = (index) => {
    const updated = history.filter((_, i) => i !== index);
    setHistory(updated);
  };

  const clearAll = () => {
    setHistory([]);
  };

  const loadIntoBuilder = (item) => {
    // Save selected to localStorage → RequestBuilder will read it
    localStorage.setItem("load-request", JSON.stringify(item));
    window.location.reload(); // Reload to fill fields
  };

  if (!history.length)
    return <p>No history yet. Make a request.</p>;

  return (
    <div>
      <button
        onClick={clearAll}
        style={{
          padding: "8px 16px",
          background: "darkred",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginBottom: "10px",
          cursor: "pointer",
        }}
      >
        Clear All History
      </button>

      {history.map((item, index) => (
        <div
          key={index}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "6px",
          }}
        >
          <p><strong>URL:</strong> {item.url}</p>
          <p><strong>Method:</strong> {item.method}</p>
          <p><strong>Saved At:</strong> {item.time}</p>

          <button
            onClick={() => loadIntoBuilder(item)}
            style={{
              padding: "6px 12px",
              background: "blue",
              color: "white",
              border: "none",
              borderRadius: "5px",
              marginRight: "8px",
            }}
          >
            Load
          </button>

          <button
            onClick={() => deleteItem(index)}
            style={{
              padding: "6px 12px",
              background: "red",
              color: "white",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default HistoryPanel;
