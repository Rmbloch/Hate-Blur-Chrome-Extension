const currentPageUrl = window.location.href;

// Encode the URL to ensure it's correctly formatted for inclusion in a query string
const encodedUrl = encodeURIComponent(currentPageUrl);

// Construct the URL for your server-side endpoint, including the current page's URL as a parameter
const fetchUrl = `http://localhost:3000/scrape?url=${encodedUrl}`;

fetch(fetchUrl)
    .then(response => response.json())
    .then(data => {
        console.log("Received data from server:", data);
        blurHateSpeech(data.extractions);
    })
    .catch(error => console.error('Error fetching the webpage from backend service:', error));


function blurHateSpeech(extractions) {
    extractions.forEach(extraction => {
        extraction.fields.forEach(field => {
            // This is a simplified example that directly replaces the text in the innerHTML.
            // Note: Directly manipulating innerHTML can have unintended consequences like breaking event listeners,
            // so consider using a more robust method for production code.
            const regex = new RegExp(field.value, 'gi');
            document.body.innerHTML = document.body.innerHTML.replace(regex, (match) => {
                return `<span class="blur">${match}</span>`;
            });
        });
    });

    // Ensure you have CSS for the "blur" class
    const style = document.createElement('style');
    style.innerHTML = `.blur { color: transparent; text-shadow: 0 0 8px rgba(0,0,0,0.5); }`;
    document.head.appendChild(style);
}
