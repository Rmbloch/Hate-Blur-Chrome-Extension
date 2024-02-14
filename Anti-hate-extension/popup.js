document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleExtension');

  // Update button text based on extension state
  function updateButtonText(enabled) {
      toggleButton.textContent = enabled ? 'Disable' : 'Enable';
  }

  // Get the current state and update the button text
  chrome.storage.sync.get({enabled: true}, (items) => {
      updateButtonText(items.enabled);
  });

  toggleButton.addEventListener('click', () => {
      // Send a message to the background script to toggle the state
      chrome.runtime.sendMessage({action: "toggle"}, (response) => {
          updateButtonText(response.enabled);
      });
  });
});
