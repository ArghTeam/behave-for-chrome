# Behave! Chrome Extension

Behave! is a Chrome extension that uses [Perspective Comment Analyzer API](https://github.com/conversationai/perspectiveapi) and hides comments on YouTube, Reddit, Twitter & Disqus depending on the desired level of toxicity. It also converts them into harmless emojis to describe hidden content.

## Installation

	$ npm install

## Usage

Run `$ gulp --watch` and load the `dist`-directory into chrome.

## Connecting to API

This extension utilizes Chrome Identity API to authorize users with OAuth 2.0. You will need to provide your own key and application ID to make it work.

1. Get your own Application ID and Public Key by uploading the extension to the Chrome Web Store at https://chrome.google.com/webstore/developer/dashboard.
2. Login to https://console.developers.google.com/ and create an OAuth Client ID with the Application ID from the previous step.
3. Setup your consent screen appropriately.
4. Paste this OAuth Client ID to a client_id field in manifest.json.
5. Paste Public Key from the step 1 to a key field in manifest.json.

## Tasks

### Build

	$ gulp


| Option         | Description                                                                                                                                           |
|----------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| `--watch`      | Starts a livereload server and watches all assets. <br>To reload the extension on change include `livereload.js` in your bundle.                      |
| `--production` | Minifies all assets                                                                                                                                   |
| `--verbose`    | Log additional data to the console.                                                                                                                   |
| `--vendor`     | Compile the extension for different vendors (chrome, firefox, opera)  Default: chrome                                                                 |
| `--sourcemaps` | Force the creation of sourcemaps. Default: !production                                                                                                |


### pack

Zips your `dist` directory and saves it in the `packages` directory.

    $ gulp pack --vendor=firefox

### Version

Increments version number of `manifest.json` and `package.json`,
commits the change to git and adds a git tag.


    $ gulp patch      // => 0.0.X

or

    $ gulp feature    // => 0.X.0

or

    $ gulp release    // => X.0.0


## Globals

The build tool also defines a variable named `ENV` in your scripts. It will be set to `development` unless you use the `--production` option.


**Example:** `./app/background.js`

	if(ENV === 'development'){
		console.log('We are in development mode!');
	}







