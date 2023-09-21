
function badgeText(txt)
{
  chrome.action.setBadgeText({
    text: txt
  });
}

// When the user clicks on the extension action
chrome.action.onClicked.addListener(async (tab) => {
  //if (!tab.url.toLowerCase().startsWith(urlEnabled.toLowerCase())) {
  //if (tab.url.toLowerCase().startsWith(urlEnabled.toLowerCase()))
  //{
    badgeText('YES');
    console.log(tab.url);
 //}
});
