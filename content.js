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

function getCurrentChatTitle() {
  try {
    const titleElement = document.querySelector(
      '[data-testid="history-item-0"] div[title]',
    );
    if (titleElement) {
      return titleElement.getAttribute("title");
    }

    const fallbackElement = document.querySelector('div[dir="auto"][title]');
    return fallbackElement
      ? fallbackElement.getAttribute("title")
      : `chat_${new Date().toISOString()}`;
  } catch (error) {
    console.error("Error getting title:", error);
    return `chat_${new Date().toISOString()}`;
  }
}

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "archiveCurrent") {
    const content = extractChatContent();
    const title = getCurrentChatTitle();
    if (content) {
      console.log("Sending content back to popup for download");
      sendResponse({
        success: true,
        content: content,
        title: title,
      });
    } else {
      sendResponse({ success: false, error: "No content extracted" });
    }
    console.log(
      "Extracted content sample:",
      title,
      content.substring(0, 100) + "...",
    );
    sendResponse({ success: true, content: content });
  }
  return true;
});
