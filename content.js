console.log("Content script is alive!");

// Add a visible element to the page so we can really see it working
const div = document.createElement("div");
div.textContent = "ChatGPT Archiver is active";
div.style.position = "fixed";
div.style.top = "10px";
div.style.right = "10px";
div.style.background = "yellow";
div.style.padding = "5px";
document.body.appendChild(div);

function extractChatContent() {
  try {
    const messages = document.querySelectorAll(
      "[data-message-author-role], .markdown",
    );
    let chatContent = "";

    messages.forEach((message) => {
      const role =
        message.getAttribute("data-message-author-role") ||
        message
          .closest("[data-message-author-role]")
          ?.getAttribute("data-message-author-role") ||
        "unknown";
      const content = message.classList.contains("markdown")
        ? message
        : message.querySelector(".markdown");
      const text = content ? content.textContent.trim() : "";

      if (text) {
        chatContent += `${role}: ${text}\n\n`;
      }
    });

    console.log("Extracted content length:", chatContent.length);
    div.textContent = `Found ${chatContent.length} characters of chat content`;
    return chatContent || "No chat content found";
  } catch (error) {
    console.error("Error extracting chat:", error);
    div.textContent = "Error: " + error.message;
    return null;
  }
}

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "archiveCurrent") {
    const content = extractChatContent();
    console.log("Extracted content sample:", content.substring(0, 100) + "...");
    sendResponse({ success: true, content: content });
  }
  return true;
});
