// background.js for URL Analyser Extension

const API_URL = "http://localhost:8000/api/classify-url";

// Keep track of URLs that the user has already allowed
// In a real extension, you'd use chrome.storage.local to persist this
let allowedUrls = new Set();

// Load allowed URLs from storage on startup
chrome.storage.local.get(["allowedUrls"], (result) => {
  if (result.allowedUrls) {
    allowedUrls = new Set(result.allowedUrls);
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Only check when the URL changes and starts with http/https
  // and we avoid infinite loops by checking if it's already a warning page
  if (changeInfo.url && 
      (changeInfo.url.startsWith("http://") || changeInfo.url.startsWith("https://")) && 
      !changeInfo.url.includes(chrome.runtime.id) &&
      !changeInfo.url.includes("chrome://") &&
      !changeInfo.url.includes("edge://") &&
      !changeInfo.url.includes("about:")) {
    
    const url = changeInfo.url;

    // Skip if user already allowed this URL or it's a localhost check
    // We check if any allowed URL is a prefix of current URL or exact match
    const isAllowed = Array.from(allowedUrls).some(allowed => url.startsWith(allowed));
    
    if (isAllowed || url.includes("localhost:8000")) {
      return;
    }

    console.log("Analysing URL:", url);

    // Call backend API for analysis
    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url }),
    })
    .then(response => {
      if (!response.ok) throw new Error("API not reachable");
      return response.json();
    })
    .then(data => {
      console.log("Analysis Result:", data);
      
      // If safety is not "safe", ask the user
      if (data && data.safety !== "safe") {
        // Redirect to a warning page with details
        const warningUrl = chrome.runtime.getURL(`warning.html?url=${encodeURIComponent(url)}&safety=${data.safety}&confidence=${data.confidence}&indicators=${encodeURIComponent(JSON.stringify(data.indicators))}`);
        chrome.tabs.update(tabId, { url: warningUrl });
      }
    })
    .catch(error => {
      console.warn("URL Analysis failed or skipped:", error.message);
    });
  }
});

// Listen for messages from the warning page
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "allowUrl") {
    allowedUrls.add(request.url);
    // Persist to storage
    chrome.storage.local.set({ allowedUrls: Array.from(allowedUrls) });
    // Redirect back to the original URL
    if (sender.tab) {
      chrome.tabs.update(sender.tab.id, { url: request.url });
    }
  }
  return true;
});
