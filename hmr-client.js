// hmr-client.js - Injected into the extension for development
const connectHMR = () => {
  const ws = new WebSocket("ws://localhost:8081");

  ws.onmessage = async (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "fileChanged") {
      // Handle different file types
      if (data.path.endsWith(".js")) {
        // For JS files, we need to reload the extension
        chrome.runtime.sendMessage({ type: "DEV_RELOAD_EXTENSION" });
      } else if (data.path.endsWith(".html")) {
        // For HTML files, we can just reload the current window
        window.location.reload();
      }
    }
  };

  ws.onerror = (error) => {
    console.error("HMR WebSocket error:", error);
  };

  ws.onclose = () => {
    // Try to reconnect after a delay
    setTimeout(connectHMR, 1000);
  };
};

connectHMR();
