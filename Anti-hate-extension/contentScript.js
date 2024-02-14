// Send a request to the backend service to scrape the current webpage
fetch('http://localhost:3000/scrape?url=' + encodeURIComponent(window.location.href))
    .then(response => response.text())
    .then(htmlContent => {
        // Parse the HTML content or process it as needed
        console.log(htmlContent);
    })
    .catch(error => console.error('Error fetching the webpage from backend service:', error));
