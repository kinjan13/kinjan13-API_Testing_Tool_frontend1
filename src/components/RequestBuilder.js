import React, { useState, useEffect, useContext } from "react";
import HeaderEditor from "./HeaderEditor";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { beautifyJSON, minifyJSON } from "../utils/jsonTools";

function RequestBuilder({ setApiResponse }) {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("GET");
  const [body, setBody] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [loading, setLoading] = useState(false);
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

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/test-request`, {
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

      // Save to backend history if user is logged in
      if (user) {
        await axios.post(`${process.env.REACT_APP_API_URL}/history/save`, {
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
    }

    setLoading(false); // Stop loading
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "0px" }}>
      <div style={{ flex: 1, overflow: "auto", minHeight: 0, paddingBottom: "12px" }}>
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

      {/* JSON Tools */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "16px", marginTop: "16px", flexWrap: "wrap" }}>
        <button
          onClick={() => setBody(beautifyJSON(body))}
          className="btn-primary"
          style={{ flex: 1, minWidth: "140px" }}
        >
          ✨ Beautify
        </button>

        <button
          onClick={() => setBody(minifyJSON(body))}
          className="btn-secondary"
          style={{ flex: 1, minWidth: "140px" }}
        >
          🔨 Minify
        </button>

        <button
          onClick={() => setBody("")}
          className="btn-danger"
          style={{ flex: 1, minWidth: "140px" }}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Copy Request Button */}
      <button
        onClick={() => {
          const req = {
            url,
            method,
            headers,
            body,
          };
          navigator.clipboard.writeText(JSON.stringify(req, null, 2));
          alert("Request copied to clipboard!");
        }}
        className="btn-secondary"
        style={{ width: "100%", marginBottom: "16px" }}
      >
        📋 Copy Request
      </button>
      </div>

      {/* Send Button - Outside Scrollable Area */}
      <button
        disabled={loading}
        className="btn-primary"
        style={{
          width: "100%",
          padding: "12px",
          fontSize: "14px",
          fontWeight: "600",
          flexShrink: 0,
          marginBottom: "0px"
        }}
        onClick={sendRequest}
      >
        {loading ? "🚀 Sending..." : "🚀 Send Request"}
      </button>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#667eea", flexShrink: 0, paddingTop: "8px", paddingBottom: "8px" }}>
          <div className="spinner"></div>
          <span>Processing request...</span>
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

export default React.memo(RequestBuilder);
