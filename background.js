chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "DEV_RELOAD_EXTENSION") {
    console.log("Reloading extension...");
    chrome.runtime.reload();
  }
});
