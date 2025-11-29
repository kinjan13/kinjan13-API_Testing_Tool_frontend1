import React, { useState, useEffect, useContext } from "react";
import HeaderEditor from "./HeaderEditor";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

function RequestBuilder({ setApiResponse }) {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const { user } = useContext(AuthContext);

  // Auto-fill from localStorage when history entry is selected
  useEffect(() => {
    const loaded = localStorage.getItem("load-request");
    if (loaded) {
      const entry = JSON.parse(loaded);
      setUrl(entry.url);
      setMethod(entry.method);
      setBody(entry.body);
      setHeaders(entry.headers);
      localStorage.removeItem("load-request");
    }
  }, []);

  const handleHeadersChange = (updatedHeaders) => {
    setHeaders(updatedHeaders);
  };

  const validateURL = (str) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const saveToHistory = () => {
    const entry = {
      url,
      method,
      body,
      headers,
      time: new Date().toLocaleString(),
    };

    setHistory((prev) => [entry, ...prev]);
  };

  const sendRequest = async () => {
    // URL Validation
    if (!validateURL(url)) {
      return setApiResponse({
        error: true,
        message: "Invalid URL format",
      });
    }

    setLoading(true); // Start loading

    try {
      // Convert headers array → object
      let headersObj = {};
      headers.forEach((h) => {
        if (h.key.trim() !== "") headersObj[h.key] = h.value;
      });

      // Validate JSON body
      let parsedBody = {};
      if (body.trim() !== "" && method !== "GET") {
        try {
          parsedBody = JSON.parse(body);
        } catch (err) {
          setLoading(false);
          return setApiResponse({
            error: true,
            message: "Invalid JSON format in request body",
          });
        }
      }

      const start = performance.now();

      const response = await axios.post("http://localhost:5000/api/test-request", {
        url,
        method,
        headers: headersObj,
        body: parsedBody,
      });

      const end = performance.now();

      setApiResponse({
        status: response.status,
        headers: response.headers,
        data: response.data,
        time: (end - start).toFixed(2),
      });

      saveToHistory();

      // Save to backend history if user is logged in
      if (user) {
        await axios.post("http://localhost:5000/history/save", {
          url,
          method,
          headers,
          body,
          time: new Date().toLocaleString(),
          user_id: user.id,
        });
      }
    } catch (error) {
      setApiResponse({
        error: true,
        message:
          error.response?.status
            ? `HTTP ${error.response.status}: ${error.response.statusText}`
            : error.message.includes("timeout")
            ? "Request timed out"
            : "Network Error: Unable to reach server",
      });

      saveToHistory();
    }

    setLoading(false); // Stop loading
  };

  return (
    <div>
      {/* URL Input */}
      <label><strong>Request URL:</strong></label>
      <input
        type="text"
        placeholder="https://jsonplaceholder.typicode.com/posts"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "8px",
          marginBottom: "15px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      {/* Method Selection */}
      <label><strong>HTTP Method:</strong></label>
      <select
        value={method}
        onChange={(e) => setMethod(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "8px",
          marginBottom: "15px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="PATCH">PATCH</option>
        <option value="DELETE">DELETE</option>
      </select>

      {/* Headers */}
      <HeaderEditor onHeadersUpdate={handleHeadersChange} />

      {/* JSON Body */}
      <label><strong>Request Body (JSON):</strong></label>
      <textarea
        placeholder='{ "title": "sample" }'
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows="6"
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "8px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
        disabled={method === "GET"}
      />

      {/* Send Button */}
      <button
        disabled={loading}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          background: loading ? "gray" : "blue",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
        onClick={sendRequest}
      >
        {loading ? "Sending..." : "Send Request"}
      </button>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px" }}>
          <div className="spinner"></div>
          <span style={{ color: "blue" }}>Sending request...</span>
        </div>
      )}

      <style>{`
        .spinner {
          border: 3px solid #f3f3f3;
          border-top: 3px solid blue;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default RequestBuilder;
