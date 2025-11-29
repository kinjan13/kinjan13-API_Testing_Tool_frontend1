import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function ResponseViewer({ apiResponse }) {
  if (!apiResponse) {
    return (
      <div style={{
        textAlign: "center",
        padding: "40px 20px",
        color: "#999"
      }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}></div>
        <p>Send a request to see the response here</p>
      </div>
    );
  }

  if (apiResponse.error) {
    return (
      <div style={{
        background: "#fee",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #fcc",
        borderLeft: "4px solid #c33"
      }}>
        <h3 style={{ color: "#c33", margin: "0 0 8px 0" }}> Error</h3>
        <p style={{ margin: 0, color: "#666" }}>{apiResponse.message}</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return "#16a34a";
    if (status >= 300 && status < 400) return "#d97706";
    return "#dc2626";
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(apiResponse.data, null, 2));
    alert("Response copied to clipboard!");
  };

  const clearResponse = () => {
    window.location.reload();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", gap: "16px" }}>
      <div style={{
        background: "#f9f9f9",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #e0e0e0",
        flexShrink: 0
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px"
        }}>
          <div>
            <h3 style={{ margin: 0, fontSize: "14px", color: "#666" }}>Status Code</h3>
            <span style={{
              fontSize: "28px",
              fontWeight: "700",
              color: getStatusColor(apiResponse.status)
            }}>
              {apiResponse.status}
            </span>
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: "14px", color: "#666" }}>Response Time</h3>
            <span style={{
              fontSize: "24px",
              fontWeight: "700",
              color: "#667eea"
            }}>
              {apiResponse.time} ms
            </span>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflow: "auto", minHeight: 0 }}>
        <div style={{ marginBottom: "20px" }}>
          <details>
            <summary style={{
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "12px",
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: "6px"
            }}>
              📋 Headers
            </summary>

            <div style={{ marginTop: "12px", borderRadius: "6px", overflow: "hidden" }}>
              <SyntaxHighlighter language="json" style={oneDark}>
                {JSON.stringify(apiResponse.headers, null, 2)}
              </SyntaxHighlighter>
            </div>
          </details>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <details open>
            <summary style={{
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "12px",
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: "6px"
            }}>
              📄 Response Body
            </summary>

            <div style={{ marginTop: "12px", borderRadius: "6px", overflow: "hidden" }}>
              <SyntaxHighlighter language="json" style={oneDark}>
                {JSON.stringify(apiResponse.data, null, 2)}
              </SyntaxHighlighter>
            </div>
          </details>
        </div>
      </div>

      <div style={{
        display: "flex",
        gap: "10px",
        justifyContent: "center",
        flexShrink: 0
      }}>
        <button
          onClick={copyToClipboard}
          className="btn-primary"
          style={{ flex: 1 }}
        >
          📋 Copy Response
        </button>
        <button
          onClick={clearResponse}
          className="btn-secondary"
          style={{ flex: 1 }}
        >
          🔄 Clear
        </button>
      </div>
    </div>
  );
}

export default React.memo(ResponseViewer);
