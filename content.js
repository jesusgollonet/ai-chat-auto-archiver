function extractChatContent() {
  try {
    const turns = document.querySelectorAll(
      '[data-testid^="conversation-turn-"]',
    );
    let chatContent = "";

    turns.forEach((turn) => {
      const roleText =
        turn
          .querySelector("[data-message-author-role]")
          ?.getAttribute("data-message-author-role") || "unknown";
      const textContainer = turn.querySelector("[data-message-author-role]");
      if (textContainer) {
        const text = textContainer.innerText.trim();
        if (text) {
          chatContent += `${roleText}: ${text}\n\n`;
        }
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
    // First try: look for the active nav item (background color indicates current chat)
    const activeChat = document.querySelector(
      '[class*="bg-[var(--sidebar-surface-tertiary)]"] div[title]',
    );
    if (activeChat) {
      return activeChat.getAttribute("title");
    }

    // Second try: check the URL and match it with the corresponding chat
    const currentPath = window.location.pathname;
    const chatElement = document.querySelector(
      `a[href="${currentPath}"] div[title]`,
    );
    if (chatElement) {
      return chatElement.getAttribute("title");
    }

    // Fallback with timestamp
    return `chat_${new Date().toISOString()}`;
  } catch (error) {
    console.error("Error getting title:", error);
    return `chat_${new Date().toISOString()}`;
  }
}

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
  if (request.action === "archiveCurrent") {
    const content = extractChatContent();
    const title = getCurrentChatTitle();
    const id = window.location.pathname.split("/")[2];
    if (content) {
      console.log("Sending content back to popup for download");
      sendResponse({
        success: true,
        content,
        title,
        id,
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
