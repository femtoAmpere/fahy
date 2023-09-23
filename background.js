
const api = 'http://127.0.0.1:45869'
const key = '0a508929a717adc08046b6254afbb8c866cd4efc831ba594953abb8053000683';

chrome.runtime.onMessage.addListener(
  function (request, sender, callback) 
  {
    console.log(request);
    console.log(sender);
    if (request.action == 'hydrusAPI')
    {
      fetch(api + request.method, {
        method: 'POST',
        headers: {
          "Content-type": "application/json; charset=UTF-8",
          'Hydrus-Client-API-Access-Key': key
        },
        body: request.data
      }).then((response) => {
        console.log(response);
        callback(response.status);
      });
    }
  return true; // return true to indicate you want to send a response asynchronously 
  }
);
