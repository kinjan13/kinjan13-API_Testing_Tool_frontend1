// Test script to verify API connectivity
// Run this in browser DevTools console on your Vercel site

async function testAuth() {
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log("🔍 API URL:", apiUrl || "❌ NOT SET");

  if (!apiUrl) {
    console.error("❌ REACT_APP_API_URL is undefined!");
    console.log("Fix: Set REACT_APP_API_URL in Vercel project environment variables");
    return;
  }

  try {
    console.log("📡 Testing connection to:", apiUrl);
    
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@test.com", password: "test" })
    });

    console.log("✅ Backend Response Status:", response.status);
    console.log("✅ CORS Header:", response.headers.get("access-control-allow-origin"));
    
    const data = await response.json();
    console.log("✅ Response Data:", data);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

// Run test
testAuth();
