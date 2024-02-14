var enabled = false;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'toggleExtension') {
    enabled = !enabled;
    if (enabled) {
      blur();
    } else {
      unblur();
    }
  } else if (request.action === 'blurSensitive') {
    if (enabled) {
      blur();
    }
  }
});

function blur() {
  var wordToBlur = 'sensitive';
  var regex = new RegExp(`\\b${wordToBlur}\\b`, 'gi');

  document.body.innerHTML = document.body.innerHTML.replace(regex, function (matched) {
    return `<span class="blurred-word" data-word="${wordToBlur}">${matched}</span>`;
  });
}

function unblur() {
  var blurredWords = document.querySelectorAll('.blurred-word');
  blurredWords.forEach(function (blurredWord) {
    blurredWord.classList.remove('blurred');
  });
}

document.body.addEventListener('click', function (event) {
  var target = event.target;
  if (target.classList.contains('blurred-word')) {
    toggleBlur(target);
  }
});

function toggleBlur(element) {
  element.classList.toggle('blurred');
}

// Initialize the extension state when the content script is injected
chrome.runtime.sendMessage({ action: 'getExtensionState' }, function (response) {
  enabled = response.enabled;
  if (enabled) {
    blur();
  }
});