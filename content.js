chrome.tabs.onUpdated.addListener((tabId, change, tab) => {
    if (change.url) {
        console.log(change.url);
    }
});