function updateStatus(message) {
  document.getElementById("status").textContent = message;
}

async function downloadChat(content, title) {
  try {
    console.log("Starting download...");

    const blob = new Blob([content], { type: "text/plain" });
    const filename = `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;

    console.log("Attempting to download:", filename);

    const downloadId = await chrome.downloads.download({
      url: URL.createObjectURL(blob),
      filename: filename,
      saveAs: false,
    });

    console.log("Download started with ID:", downloadId);
    return downloadId;
  } catch (error) {
    console.error("Download error:", error);
    throw error;
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

      const response = await chrome.tabs.sendMessage(tab.id, {
        action: "archiveCurrent",
      });

      updateStatus("Archiving current chat...");
      if (response.success) {
        await downloadChat(response.content, response.title);
        updateStatus("Chat archived successfully!");
      } else {
        updateStatus("Error: " + (response.error || "Unknown error"));
      }
      updateStatus("Chat archived successfully!");
    } catch (error) {
      updateStatus("Error: " + error.message);
      console.error("Error:", error);
    }
  });

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
