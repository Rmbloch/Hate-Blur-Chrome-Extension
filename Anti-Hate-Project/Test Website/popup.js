document.addEventListener('DOMContentLoaded', function () {
  var toggleButton = document.getElementById('toggle-extension');

  toggleButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleExtension' });
    });
  });
});