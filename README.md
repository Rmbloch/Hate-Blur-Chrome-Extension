# HateBlocker

The HateBlocker Chrome Extension is a Google Chrome Extension that blocks hate speech on webpages

## To Use the Extension
1. Clone the Repository

2. Run the Server

The extension relies on a backend server to analyze web page content for hate speech. Go to to the server directory (Anti-Hate-backend since it contains server.js) and run the following commands:

```console
npm install
node server.js
```

3. Load the Extension in Chrome

Open your Chrome browser and navigate to chrome://extensions/.
Enable "Developer mode" at the top right corner.
Click "Load unpacked" and select the extension directory from your local machine (Anti-hate-extension).
The extension now appears among your other extensions and is ready to use.

## Usage
### Activating the Extension
Once installed, you will see the extension's icon in the Chrome toolbar.
When enabled, the extension automatically blurs detected hate speech on web pages you visit.
Hover over blurred text to remove the blur and see the hate speech
