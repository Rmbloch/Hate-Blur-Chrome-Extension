const express = require('express');
const cheerio = require('cheerio');
const { NLClient, Language } = require("@expertai/nlapi");

const app = express();
const port = 3000;

// Define a list of allowed base URLs
const allowedBaseURLs = ['http://127.0.0.1:5500'];

// Initialize the Expert.ai Natural Language API client
const nlClient = new NLClient();

// Initialize an empty array to store the extracted terms
const extractedTerms = [];

// Enable CORS for all routes
const cors = require('cors');
app.use(cors());

// Define a route to scrape a webpage and detect hate speech
app.get('/scrape', async (req, res) => {
    const url = req.query.url;

    try {
        console.log('Requested URL:', url);
        console.log('Allowed Base URLs:', allowedBaseURLs);

        // Check if the requested URL matches any of the allowed base URLs
        const baseURL = new URL(url).origin;
        if (!allowedBaseURLs.includes(baseURL)) {
            console.error('Requested URL not allowed:', url);
            res.status(403).send('Access to this website is not allowed');
            return;
        }

        const fetch = (await import('node-fetch')).default;

        // Fetch the HTML content of the webpage
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch webpage');
        }
        const htmlContent = await response.text();

        // Use cheerio to parse the HTML content
        const $ = cheerio.load(htmlContent);

        // Extract text content from the parsed HTML
        const textContent = $('body').text();

        // Detect hate speech using the Expert.ai Natural Language API
        const result = await nlClient.detect(textContent, {
            language: Language.EN,
            detector: "hate-speech"
        });

        // Send the hate speech detection result as the response
        if (result.success && result.data.length != 0) {
            const { extractions } = result.data;
            if (extractions.length > 0) {
                console.log("Extracted terms identified as hate speech:");
                extractions.forEach(extraction => {
                    extraction.fields.forEach(field => {
                        // If at least one element contains the extracted term in its textContent, add it to extractedTerms
                        if (textContent.includes(field.value)) {
                            console.log(`- Flagged: ${field.value}`);
                            extractedTerms.push(field.value);
                        }
                    });
                });
            }
            // Process the result
            // Output the detected hate speech categories and extractions
            res.send(extractedTerms);
        } else {
            console.log("No hate speech detected.");
            res.send({ success: false, message: "No hate speech detected." });
        }
        // Clear the extractedTerms array after sending to the client
        extractedTerms.length = 0;
    } catch (error) {
        console.error('Error scraping the webpage:', error);
        res.status(500).send('Error scraping the webpage');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend service listening at http://localhost:${port}`);
});
