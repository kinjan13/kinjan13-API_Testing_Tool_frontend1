import React, { useState } from "react";
import RequestBuilder from "../components/RequestBuilder";
import ResponseViewer from "../components/ResponseViewer";
import "../styles/style.css";

function Home() {
  const [apiResponse, setApiResponse] = useState(null);

  return (
    <div className="home-container">
      <div className="home-header">
        
      </div>
      
      <div className="api-grid">
        <div className="left-panel">
          <RequestBuilder setApiResponse={setApiResponse} />
        </div>

        <div className="right-panel">
          <ResponseViewer apiResponse={apiResponse} />
        </div>
      </div>
    </div>
  );
}

export default Home;
