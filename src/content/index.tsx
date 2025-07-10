console.log("[SendShield] Content script loaded");

function waitForGmailCompose(callback: () => void) {
  const CHECK_INTERVAL = 1000;
  const MAX_RETRIES = 30;
  let retries = 0;

  const interval = setInterval(() => {
    const composeButton = document.querySelector("div[gh='cm']"); // Gmail's compose button
    if (composeButton) {
      clearInterval(interval);
      console.log("[SendShield] Compose button detected. Initializing...");
      callback();
    } else {
      retries++;
      if (retries > MAX_RETRIES) {
        clearInterval(interval);
        console.warn("[SendShield] Compose button not found. Giving up.");
      }
    }
  }, CHECK_INTERVAL);
}

function initializeSendShieldFeatures() {
  // Your logic to inject UI, delay send, hook into Gmail compose, etc.
  console.log("[SendShield] Initialized!");
  // Example: add listener to compose button
  const composeButton = document.querySelector("div[gh='cm']");
  composeButton?.addEventListener("click", () => {
    console.log("[SendShield] Compose clicked");
    // Later hook into email send
  });
}

// Gmail is SPA — watch URL changes
let lastUrl = location.href;
new MutationObserver(() => {
  const currentUrl = location.href;
  if (currentUrl !== lastUrl) {
    lastUrl = currentUrl;
    console.log("[SendShield] URL changed to", currentUrl);
    waitForGmailCompose(initializeSendShieldFeatures);
  }
}).observe(document, { subtree: true, childList: true });

// Run on initial load
waitForGmailCompose(initializeSendShieldFeatures);
