console.log('[SendShield] Content script loaded');

const DEFAULT_DELAY_SECONDS = 60;

// Utility: Find all visible send buttons in Gmail
function getSendButtons(): HTMLElement[] {
  return Array.from(document.querySelectorAll('[aria-label="Send"]'))
    .filter((el) => el instanceof HTMLElement && (el as HTMLElement).offsetParent !== null) as HTMLElement[];
}

// Show delay overlay UI
function showDelayShield(delaySeconds: number, cancelCallback: () => void) {
  const shield = document.createElement('div');
  shield.innerText = `Delaying send (${delaySeconds}s) – Click to cancel`;
  shield.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #1f1f1f;
    color: white;
    padding: 10px 16px;
    border-radius: 12px;
    font-family: Inter, sans-serif;
    font-size: 14px;
    z-index: 9999;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: opacity 0.2s ease-in-out;
  `;

  document.body.appendChild(shield);

  shield.addEventListener('click', () => {
    cancelCallback();
    shield.innerText = 'Send cancelled';
    setTimeout(() => document.body.removeChild(shield), 2000);
  });

  return shield;
}

// Intercept send button clicks globally
function interceptAllSendButtons(delaySeconds: number = DEFAULT_DELAY_SECONDS) {
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    if (!target) return;
    // Check if the click is on a send button or its child
    const sendBtn = target.closest('[aria-label="Send"]') as HTMLElement | null;
    if (sendBtn && sendBtn.offsetParent !== null) {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      console.log('[SendShield] Intercepted Send');

      // Show delay UI
      const shield = showDelayShield(delaySeconds, cancelSend);
      let cancelled = false;
      const timer = setTimeout(() => {
        if (!cancelled) {
          document.body.removeChild(shield);
          console.log('[SendShield] Delay complete. Sending now...');
          // Dispatch a new click event to the button
          sendBtn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
        }
      }, delaySeconds * 1000);

      function cancelSend() {
        cancelled = true;
        clearTimeout(timer);
        console.log('[SendShield] Send cancelled by user.');
      }
    }
  }, true); // Use capture phase to intercept before Gmail
}

// Watch for DOM changes to handle dynamic Gmail UI
function observeGmailUI() {
  const observer = new MutationObserver(() => {
    // This will keep the event listener active for new buttons
    // (No-op, as we use event delegation)
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

// Bootstrap
interceptAllSendButtons(DEFAULT_DELAY_SECONDS);
observeGmailUI();
