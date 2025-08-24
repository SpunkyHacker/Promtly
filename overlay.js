// overlay.js
let overlayDiv = null;

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "show_analysis") {
    showOverlay(msg.original, msg.analysis);
  }
});

function showOverlay(original, analysis) {
  // Remove old overlay if it exists
  if (overlayDiv) overlayDiv.remove();

  overlayDiv = document.createElement("div");
  overlayDiv.style.position = "fixed";
  overlayDiv.style.bottom = "20px";
  overlayDiv.style.right = "20px";
  overlayDiv.style.maxWidth = "400px";
  overlayDiv.style.maxHeight = "300px";
  overlayDiv.style.overflow = "auto";
  overlayDiv.style.background = "white";
  overlayDiv.style.border = "2px solid #444";
  overlayDiv.style.borderRadius = "12px";
  overlayDiv.style.boxShadow = "0 4px 12px rgba(0,0,0,0.3)";
  overlayDiv.style.zIndex = "999999";
  overlayDiv.style.padding = "12px";
  overlayDiv.style.fontFamily = "sans-serif";
  overlayDiv.style.fontSize = "14px";

  overlayDiv.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <strong>Prompt Analysis</strong>
      <button id="closeOverlay" style="border:none;background:none;font-size:16px;cursor:pointer;">✖</button>
    </div>
    <div style="margin-top:8px;">
      <b>Original:</b> <blockquote>${original}</blockquote>
      <pre style="white-space:pre-wrap;">${analysis}</pre>
    </div>
  `;

  document.body.appendChild(overlayDiv);

  document.getElementById("closeOverlay").addEventListener("click", () => {
    overlayDiv.remove();
    overlayDiv = null;
  });
}
