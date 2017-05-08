# Behave! For Chrome Extension

Behave! is a Google Chrome extension that hides comments on YouTube, Reddit, Twitter & Disqus depending on the desired level of toxicity. It also converts them into harmless emojis to describe hidden content.

## Installation

	$ npm install

## Usage

- For local development run `$ npm start` and load the `dist` directory into chrome.
- Use `$ npm run build` to get your build ready and delivered into `packages` directory.
- Look into `tasks/version.js` for versioning tasks.

## Connecting to API

This extension utilizes Chrome Identity API to authorize users with OAuth 2.0. You will need to provide your own key and application ID to make it work for your fork.

1. Get your own Application ID and Public Key by uploading the extension to the Chrome Web Store at https://chrome.google.com/webstore/developer/dashboard.
2. Login to https://console.developers.google.com/ and create an OAuth Client ID with the Application ID from the previous step.
3. Setup your consent screen appropriately.
4. Paste this OAuth Client ID to a `client_id` field in manifest.json.
5. Paste Public Key from the step 1 to a `key` field in manifest.json.
