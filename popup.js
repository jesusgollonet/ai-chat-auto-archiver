function updateStatus(message) {
  document.getElementById("status").textContent = message;
}

async function executeWithRetry(tabId, action) {
  try {
    // First attempt to send message
    const response = await chrome.tabs.sendMessage(tabId, { action: action });
    return response;
  } catch (error) {
    // If first attempt fails, wait a moment and try again
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return await chrome.tabs.sendMessage(tabId, { action: action });
  }
}

document
  .getElementById("archiveCurrentBtn")
  .addEventListener("click", async () => {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (!tab.url.includes("chatgpt.com")) {
        updateStatus("Please navigate to ChatGPT to archive chats");
        return;
      }

      updateStatus("Archiving current chat...");
      await executeWithRetry(tab.id, "archiveCurrent");
      updateStatus("Current chat archived successfully!");
    } catch (error) {
      updateStatus("Error: " + error.message);
      console.error("Error:", error);
    }
  });

// Similar changes for the Archive All button
document.getElementById("archiveAllBtn").addEventListener("click", async () => {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab.url.includes("chatgpt.com")) {
      updateStatus("Please navigate to ChatGPT to archive chats");
      return;
    }

    updateStatus("Archiving all chats...");
    await executeWithRetry(tab.id, "archiveAll");
    updateStatus("All chats archived successfully!");
  } catch (error) {
    updateStatus("Error: " + error.message);
    console.error("Error:", error);
  }
});
