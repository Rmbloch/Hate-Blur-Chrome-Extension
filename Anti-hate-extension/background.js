// Listen for the extension being installed or updated
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed/updated.");

  // Test setting a value
  chrome.storage.sync.set({ enabled: true }, () => {
      if (chrome.runtime.lastError) {
          console.error("Error setting value:", chrome.runtime.lastError);
      } else {
          console.log("Value set successfully.");
      }
  });

  // Test retrieving a value
  chrome.storage.sync.get("enabled", (result) => {
      if (chrome.runtime.lastError) {
          console.error("Error getting value:", chrome.runtime.lastError);
      } else {
          console.log("Value retrieved:", result.enabled);
      }
  });
});
