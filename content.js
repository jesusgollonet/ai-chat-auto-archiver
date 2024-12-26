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
    return chatContent || "No chat content found";
  } catch (error) {
    console.error("Error extracting chat:", error);
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
