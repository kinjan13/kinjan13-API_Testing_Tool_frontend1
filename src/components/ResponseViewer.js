import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function ResponseViewer({ apiResponse }) {
  if (!apiResponse) return <p>No response yet.</p>;

  if (apiResponse.error) {
    return (
      <div style={{ background: "#ffe5e5", padding: "12px", borderRadius: "6px" }}>
        <h3 style={{ color: "red" }}>❌ Error</h3>
        <p>{apiResponse.message}</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return "green";
    if (status >= 300 && status < 400) return "orange";
    return "red";
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(apiResponse.data, null, 2));
    alert("Response copied to clipboard!");
  };

  const clearResponse = () => {
    window.location.reload();
  };

  return (
    <div>
      <h3>
        Status:{" "}
        <span style={{ color: getStatusColor(apiResponse.status) }}>
          {apiResponse.status}
        </span>
      </h3>

      <p><strong>Response Time:</strong> {apiResponse.time} ms</p>

      <div>
        <details>
          <summary style={{ cursor: "pointer", fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
            Headers
          </summary>

          <SyntaxHighlighter language="json" style={oneDark}>
            {JSON.stringify(apiResponse.headers, null, 2)}
          </SyntaxHighlighter>
        </details>
      </div>

      <div style={{ marginTop: "15px" }}>
        <details open>
          <summary style={{ cursor: "pointer", fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
            Response Body
          </summary>

          <SyntaxHighlighter language="json" style={oneDark}>
            {JSON.stringify(apiResponse.data, null, 2)}
          </SyntaxHighlighter>
        </details>
      </div>

      <button onClick={copyToClipboard} style={{ padding: "8px 16px", background: "purple", color: "white", borderRadius: "5px", border: "none", marginRight: "10px", marginTop: "15px" }}>Copy Response</button>

      <button onClick={clearResponse} style={{ padding: "8px 16px", background: "darkred", color: "white", borderRadius: "5px", border: "none", marginTop: "15px" }}>Clear</button>
    </div>
  );
}

export default React.memo(ResponseViewer);
