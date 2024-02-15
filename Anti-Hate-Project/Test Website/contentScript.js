let enabled = true; // Default state

// Listen for messages from the background or popup script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'toggleExtension') {
        //enabled = !enabled; // Toggle the enabled state
        if (request.enabled) {
            // If re-enabled, you might want to re-fetch and re-apply blurring
            fetchAndBlur();
        } else {
            unblur(); // Remove blurring
        }
    }
});

if(enabled){
    fetchAndBlur();
}
// Fetch data from the server and blur content if enabled
function fetchAndBlur() {
    const currentPageUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentPageUrl);
    const fetchUrl = `http://localhost:3000/scrape?url=${encodedUrl}`;

    fetch(fetchUrl)
        .then(response => response.json())
        .then(data => {
            console.log("Received data from server:", data);
            //if (enabled) {
                blurHateSpeech(data.extractions);
            //}
        })
        .catch(error => console.error('Error fetching the webpage from backend service:', error));
}

// Blur function adjusted for dynamic words
function blurWord(wordToBlur) {
    var regex = new RegExp(`\\b${wordToBlur}\\b`, 'gi');

    document.body.innerHTML = document.body.innerHTML.replace(regex, function (matched) {
        return `<span class="blurred-word" data-word="${wordToBlur}">${matched}</span>`;
    });
}

// Call to blur words based on fetched data
function blurHateSpeech(extractions) {
    extractions.forEach(extraction => {
        extraction.fields.forEach(field => {
            blurWord(field.value);
        });
    });

    // Add CSS for blurred words
    const style = document.createElement('style');
    style.innerHTML = `.blurred-word { color: transparent; text-shadow: 0 0 8px rgba(0,0,0,0.5); }`;
    document.head.appendChild(style);
}

// Example unblur function that could be defined in blur.js or in this script
/* function unblur() {
    var blurredWords = document.querySelectorAll('.blurred-word');
  blurredWords.forEach(function (blurredWord) {
    blurredWord.classList.remove('blurred');
  });
} */

// Fetch and blur content on script load if enabled
/* if (enabled) {
    fetchAndBlur();
} */


