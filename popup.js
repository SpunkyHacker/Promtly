window.addEventListener("DOMContentLoaded", () => {
  const promptEl = document.getElementById("prompt");
  const responseEl = document.getElementById("response");
  const askBtn = document.getElementById("ask");
  const improveBtn = document.getElementById("improve");

  // If shortcut triggered, auto-fill & auto-improve
  chrome.storage.local.get("autoImproveText", (data) => {
    if (data.autoImproveText) {
      promptEl.value = data.autoImproveText;
      chrome.storage.local.remove("autoImproveText");
      improveBtn.click(); // auto-trigger improve
    }
  });

  askBtn.addEventListener("click", () => {
    const prompt = promptEl.value;
    responseEl.textContent = "Analyzing...";

    chrome.runtime.sendMessage({ type: "analyzePrompt", prompt }, (response) => {
      if (response.error) {
        responseEl.innerHTML = `<span class="error">Error: ${response.error}</span>`;
      } else {
        responseEl.textContent = response.result;
      }
    });
  });

  improveBtn.addEventListener("click", () => {
    const prompt = promptEl.value;
    responseEl.textContent = "Improving...";

    chrome.runtime.sendMessage({ type: "improvePrompt", prompt }, (response) => {
      if (response.error) {
        responseEl.innerHTML = `<span class="error">Error: ${response.error}</span>`;
      } else {
        responseEl.textContent = response.result;
      }
    });
  });
});
