# faHy - femtoAmpere/FurAffinity Hydrus Browser Extension for FurAffinity Classic Users

This is a simple browser extension I wrote for personal use to send FurAffinity.net submissions to Hydrus via API.
It adds a small button to the submission title **in classic layout**, saying something like

![[ Send to Hydrus ]](images/example.png)

## Using faHy

- Put your Hydrus importer credentials in `background.js`
- Install like <https://gitgud.io/prkc/hydrus-companion>
- 600 means OK (import := 200 + add urls := 200 + add notes := 200)
- In order to display imported urls in the media viewer you can,
  - import `url-classes/fahy.json` with `hydrus main window -> network -> downloader components -> manage url classes -> import -> from json files`
  - or just enable `hydrus main window -> network -> downloaders -> manage downloader and url display -> media viewer urls -> show urls that do not have a matching url class?`

## More Information

- **Only tested in Google Chrome.**
- This has to be an extension and cannot only be an injected script (e.g. Tampermonkey) due to CORS policy.
