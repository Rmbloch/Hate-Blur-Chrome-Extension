const express = require('express');
const cheerio = require('cheerio');
const { NLClient, Language } = require("@expertai/nlapi");

const app = express();
const port = 3000;

// Allowed URLs
const allowedBaseURLs = ['http://127.0.0.1:5500'];

// Natural Language API
const nlClient = new NLClient();

// Make an array that will store the hate speech terms that we extract
const extractedTerms = [];

// Enable CORS
const cors = require('cors');
app.use(cors());

// Scrape webpage
app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    try {
        console.log('Requested URL:', url);
        console.log('Allowed Base URLs:', allowedBaseURLs);

        // Check if the URL of the website is the one with out test website. If we were able to use this on social media we would put websites like twitter, instagram, etc. in the allowedUrls array
        const baseURL = new URL(url).origin;
        if (!allowedBaseURLs.includes(baseURL)) {
            console.error('Requested URL not allowed:', url);
            res.status(403).send('Access to this website is not allowed');
            return;
        }

        const fetch = (await import('node-fetch')).default;

        // Fetch content of the page
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch webpage');
        }
        const htmlContent = await response.text();

        // Cheerio parses the html content
        const $ = cheerio.load(htmlContent);

        // Extract the content
        const textContent = $('body').text();

        // NL API. Set language to English and detctor to hate speech since that's all we care about from the api
        const result = await nlClient.detect(textContent, {
            language: Language.EN,
            detector: "hate-speech"
        });

        // If there is hate speech and the data is not 0
        if (result.success && result.data.length != 0) {
            const { extractions } = result.data;
            if (extractions.length > 0) {
                console.log("Extracted terms identified as hate speech:");
                extractions.forEach(extraction => {
                    extraction.fields.forEach(field => {
                        // If at least one element contains the extracted term in its textContent, add it to extractedTerms. Was originally giving us the category too which would blur terms that weren't hate speech
                        if (textContent.includes(field.value)) {
                            console.log(`- Flagged: ${field.value}`);
                            extractedTerms.push(field.value);
                        }
                    });
                });
            }
            // Send result to the client-side
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

// Start server
app.listen(port, () => {
    console.log(`Backend service listening at http://localhost:${port}`);
});
