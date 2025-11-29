import React from "react";

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

      <h4>Headers:</h4>
      <pre style={{ background: "#f0f0f0", padding: "10px" }}>
        {JSON.stringify(apiResponse.headers, null, 2)}
      </pre>

      <h4>Response Body:</h4>
      <pre style={{ background: "#222", color: "lightgreen", padding: "15px" }}>
        {JSON.stringify(apiResponse.data, null, 2)}
      </pre>

      <button onClick={copyToClipboard} style={{ padding: "8px 16px", background: "purple", color: "white", borderRadius: "5px", border: "none", marginRight: "10px" }}>Copy Response</button>

      <button onClick={clearResponse} style={{ padding: "8px 16px", background: "darkred", color: "white", borderRadius: "5px", border: "none" }}>Clear</button>
    </div>
  );
}

export default ResponseViewer;
