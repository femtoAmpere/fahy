
const api = 'http://127.0.0.1:45869'
const key = 'deadbeef';

const headers = 
{
  "Content-type": "application/json; charset=UTF-8",
  'Hydrus-Client-API-Access-Key': key
};

function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

function hyGetHash(url, n = 4) {
  return fetch(api + '/add_urls/get_url_files?url=' + url,
    {
      method: 'GET',
      headers: headers
    })
    .then(function (response) {
      return response.json();
    })
    .then(function (result) {
      if (result.url_file_statuses.length == 0) throw error;
      return result.url_file_statuses[0].hash;
    })
    .catch(function (error) {
      if (n <= 1) throw error;
      return wait(4*1000).then(() => hyGetHash(url, n - 1));
    });
}

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
        hash: hash
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

async function hyApiMain(importUrl, tags, urls=[], notes={})
{
  const addUrlResponse = await hyAddUrl(importUrl, tags);
  const hash = await hyGetHash(importUrl);
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
