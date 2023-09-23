
const api = 'http://127.0.0.1:45869'
const key = '0a508929a717adc08046b6254afbb8c866cd4efc831ba594953abb8053000683';

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  console.log('clicked');

  if (!tab.url.includes("furaffinity.net/view/"))
  {
    badgeText('ERR');
    return;
  }
  badgeText('WORK');
  console.log(tab.document);

  tags = ["url:" + tab.url];
  executeScript({
    code: "document.documentElement.innerHTML" // or 'file: "getPagesSource.js"'
  }, function (result) {
    if (chrome.runtime.lastError) {
      console.error(chrome.runtime.lastError.message);
    } else {
      console.log(result)
    }
  });
});

chrome.runtime.onMessage.addListener(
  function (request, sender, callback) {
    if (request.action == 'hydrusAPI')
    {
      console.log(request);
      callback('Success!');
    }
  }
);
