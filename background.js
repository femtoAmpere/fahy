
const api = 'http://127.0.0.1:45869'
const key = 'deadbeef';

const headers = 
{
  "Content-type": "application/json; charset=UTF-8",
  'Hydrus-Client-API-Access-Key': key
};

async function hyAssociateUrl(hash, urls)
{
  return await fetch(api + '/add_urls/associate_url',
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        urls_to_add: urls,
        hash: hash
      })
    }
  );
}

async function hySetNotes(hash, notes) {
  return await fetch(api + '/add_notes/set_notes',
    {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({
        notes: notes,
        hash: hash,
        merge_cleverly: true
      })
    }
  );
}

async function hyAddUrl(importUrl, tags)
{
  return await fetch(api + '/add_urls/add_url', 
    { 
      method: 'POST',
      headers: headers,
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

async function getHash(url) {
  const imageResponse = await fetch(url);
  if (imageResponse.status !== 200) {
    throw new Error(`Failed to get ${url} with status code ${imageResponse.status}`);
    //return '0';
  }
  const image = await imageResponse.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', image);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

async function hyApiMain(importUrl, tags, urls=[], notes={})
{
  const addUrlResponse = await hyAddUrl(importUrl, tags);

  const hash = await getHash(importUrl);
  const associateUrlResponse = await hyAssociateUrl(hash, urls);
  const setNotesResponse = await hySetNotes(hash, notes);

  // return value will show on page
  return '<span title="' +
    'fahyAddDB: ' + addUrlResponse.status + '; ' +
    'fahyLinks: ' + associateUrlResponse.status + '; ' +
    'fahyNotes: ' + setNotesResponse.status + '; ' +
    'Image Hash: ' + hash + '; ' + 
    '">' + (addUrlResponse.status + associateUrlResponse.status + setNotesResponse.status) + '</span>'
}

chrome.runtime.onMessage.addListener(
  function (msg, sender, callback)
  {
    console.log(msg);
    console.log(sender);
    if (msg.action == 'hydrusAPI')
    {
      hyApiMain(msg.importUrl, msg.tags, msg.urls, msg.notes)
      .then((response) => {
        console.log(response);
        callback(response);
      });
    }
  return true; // return true to indicate you want to send a response asynchronously 
  }
);
