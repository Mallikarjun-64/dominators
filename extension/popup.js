// popup.js for URL Analyser Extension

document.addEventListener("DOMContentLoaded", async () => {
  const statusValue = document.getElementById("status-value");
  const urlText = document.getElementById("url-text");
  const scanBtn = document.getElementById("scan-btn");

  // Get current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.url) {
    urlText.textContent = tab.url;
  }

  scanBtn.addEventListener("click", async () => {
    if (!tab || !tab.url) return;

    // Prevent scanning internal browser pages
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://") || tab.url.startsWith("about:")) {
      statusValue.textContent = "System Page (Protected)";
      statusValue.className = "status-value safe";
      return;
    }
    
    scanBtn.disabled = true;
    scanBtn.innerHTML = '<div class="loader"></div><span>Scanning...</span>';
    statusValue.textContent = "Scanning...";
    
    try {
      const response = await fetch("http://localhost:8000/api/classify-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: tab.url }),
      });

      const data = await response.json();
      
      if (data.safety === "safe") {
        statusValue.textContent = "Safe Link";
        statusValue.className = "status-value safe";
      } else if (data.safety === "suspicious") {
        statusValue.textContent = "Suspicious Link";
        statusValue.className = "status-value suspicious";
      } else {
        statusValue.textContent = "Phishing Detected";
        statusValue.className = "status-value danger";
      }
      
    } catch (error) {
      statusValue.textContent = "Backend Offline";
      statusValue.className = "status-value danger";
      console.error("Connection error:", error);
    } finally {
      scanBtn.disabled = false;
      scanBtn.textContent = "Scan Again";
    }
  });
});
