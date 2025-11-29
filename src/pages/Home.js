import React, { useState } from "react";
import RequestBuilder from "../components/RequestBuilder";
import ResponseViewer from "../components/ResponseViewer";
import "../styles/style.css";

function Home() {
  const [apiResponse, setApiResponse] = useState(null);

  return (
    <div className="container">
      <div className="api-grid">
        <div className="left-panel">
          <div className="panel-header">📝 Request Builder</div>
          <RequestBuilder setApiResponse={setApiResponse} />
        </div>

        <div className="right-panel">
          <div className="panel-header">📊 Response Viewer</div>
          <ResponseViewer apiResponse={apiResponse} />
        </div>
      </div>
    </div>
  );
}

export default Home;
