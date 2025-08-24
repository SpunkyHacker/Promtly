chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "analyzePrompt" || message.type === "improvePrompt") {
    const isImprove = message.type === "improvePrompt";

    const taskPrompt = isImprove
      ? `
You are a prompt improvement assistant.
Improve the following prompt so it is clearer, more specific, and optimized for AI models. Return only the improved version.

Prompt: "${message.prompt}"
`
      : `
You are a prompt improvement assistant.
Analyze the following prompt: "${message.prompt}"

Return results in this exact format:
Problem: <one sentence>
Solution: <one sentence>
Score: <number from 1-10>
Variations:
1. <variation>
2. <variation>
3. <variation>
`;

    fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1:8b",
        messages: [{ role: "user", content: taskPrompt }],
        stream: false
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Ollama response:", data);
        if (data.message && data.message.content) {
          sendResponse({ result: data.message.content });
        } else {
          sendResponse({ error: "No content in response" });
        }
      })
      .catch((err) => sendResponse({ error: err.message }));

    return true; // keep async alive
  }
});

// Handle shortcut: improve selected/input text
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "improve_selection") {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    chrome.scripting.executeScript(
      {
        target: { tabId: tab.id },
        func: () => {
          const selection = window.getSelection().toString();
          let inputText = "";
          const activeEl = document.activeElement;
          if (
            activeEl &&
            (activeEl.tagName === "TEXTAREA" || activeEl.tagName === "INPUT")
          ) {
            inputText = activeEl.value;
          }
          return selection || inputText || "";
        }
      },
      (results) => {
        const text = results?.[0]?.result || "";
        if (text) {
          chrome.storage.local.set({ autoImproveText: text }, () => {
            chrome.action.openPopup();
          });
        }
      }
    );
  }
});
