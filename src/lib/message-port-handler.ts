// Handle message port connections
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message.includes('The message port closed before a response was received')) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  // Clean up message ports on page unload
  window.addEventListener('beforeunload', () => {
    // Close any open message ports
    const chrome = (window as any).chrome;
    if (chrome?.runtime) {
      try {
        chrome.runtime.sendMessage({ type: 'cleanup' });
      } catch (error) {
        // Ignore errors during cleanup
      }
    }
  });
} 