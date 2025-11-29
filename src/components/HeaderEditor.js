import React, { useState, useEffect } from "react";

function HeaderEditor({ onHeadersUpdate }) {
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);

  useEffect(() => {
    if (typeof onHeadersUpdate === "function") {
      onHeadersUpdate(headers);
    }
  }, [headers, onHeadersUpdate]);

  const handleChange = (index, field, value) => {
    setHeaders((prev) =>
      prev.map((h, i) => (i === index ? { ...h, [field]: value } : h))
    );
  };

  const addHeader = () => {
    setHeaders((prev) => [...prev, { key: "", value: "" }]);
  };

  const removeHeader = (indexToRemove) => {
    setHeaders((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div>
      <label>
        <strong>Headers:</strong>
      </label>

      {headers.map((header, index) => (
        <div key={index} style={{ display: "flex", marginTop: "8px" }}>
          <input
            type="text"
            placeholder="Key"
            value={header.key}
            onChange={(e) => handleChange(index, "key", e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              marginRight: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="text"
            placeholder="Value"
            value={header.value}
            onChange={(e) => handleChange(index, "value", e.target.value)}
            style={{
              flex: 1,
              padding: "8px",
              marginLeft: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
          <button
            type="button"
            onClick={() => removeHeader(index)}
            style={{
              marginLeft: "8px",
              padding: "6px 10px",
              background: "#d9534f",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      ))}

      <button
        type="button"
        style={{
          marginTop: "10px",
          padding: "6px 12px",
          background: "green",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={addHeader}
      >
        + Add Header
      </button>
    </div>
  );
}

export default HeaderEditor;
