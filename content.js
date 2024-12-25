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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Message received in content script:", request);
  div.textContent = "Received message: " + request.action;
  sendResponse({ success: true, message: "Message received!" });
  return true;
});
