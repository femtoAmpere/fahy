
const api = 'http://127.0.0.1:45869'
const key = 'deadbeef';

async function hyGetHash(url)
{

}

async function hyApiAssociateUrl(hash, urls)
{
  
}

async function hyAddUrl(importUrl, tags)
{
  return await fetch(api + '/add_urls/add_url', 
    { 
      method: 'POST',
      headers: {
        "Content-type": "application/json; charset=UTF-8",
        'Hydrus-Client-API-Access-Key': key
      },
      body: JSON.stringify({
        url: importUrl,
        //destination_page_key: 1,
        destination_page_name: 'FurAffinity.net',
        show_destination_page: false,
        //service_keys_to_additional_tags
        filterable_tags: tags
      })
    }
  );
}

async function hyApiMain(importUrl, tags, urls=[])
{
  const addUrlResponse = await hyAddUrl(importUrl, tags);

  return addUrlResponse.status;
}

chrome.runtime.onMessage.addListener(
  function (msg, sender, callback) 
  {
    console.log(msg);
    console.log(sender);
    if (msg.action == 'hydrusAPI')
    {
      hyApiMain(msg.importUrl, msg.tags, msg.urls)
      .then((response) => {
        console.log(response);
        callback(response);
      });
    }
  return true; // return true to indicate you want to send a response asynchronously 
  }
);
