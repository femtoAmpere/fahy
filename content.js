
function hyGetTags() {
    var tags = [];
    tags.push('site:furaffinity');
    tags.push('import:' + new Date().toISOString());
    tags.push('importer:fahy');

    const pageUrl = window.location.href.endsWith('/') ? window.location.href : window.location.href + '/';
    tags.push('url:' + pageUrl);
    tags.push('id:' + pageUrl.split('/').at(-2));

    const downloadUrl = hyGetUrl();
    tags.push('url:' + downloadUrl);

    const filename = downloadUrl.split(/(\\|\/)/g).pop();
    tags.push('filename:' + filename);
    tags.push('extension:' + filename.split('.').at(-1));
    tags.push('faid:' + filename.split('.').at(0));

    const submissionInfos = document.getElementsByClassName('classic-submission-title information')[0];
    tags.push('title:' + submissionInfos.firstElementChild.innerText);
    tags.push('creator:' + submissionInfos.lastElementChild.innerText);
    tags.push('url:https://furaffinity.net/user/' + submissionInfos.lastElementChild.innerText + '/');

    const stats = document.getElementsByClassName('alt1 stats-container')[0].getElementsByTagName('b');
    for (const a in stats)
    {
        var thisText = stats[a].innerText;
        switch (thisText) {
            case undefined:
                break;
            case 'Submission Information:':
                break;
            case 'Posted:':
                tags.push(thisText + stats[a].nextElementSibling.title);
                tags.push(thisText + stats[a].nextElementSibling.innerText);
                break;
            case 'Image Specifications:':
                break;
            case 'Favorites:':
                tags.push(thisText + stats[a].nextElementSibling.innerText);
                break;
            default:
                tags.push(thisText + stats[a].nextSibling.textContent);
        }
    }

    const keywords = document.getElementById('keywords');
    if (keywords) {
        const htmlTags = keywords.getElementsByTagName('a');
        for (const a in htmlTags) {
            var tag = htmlTags[a].innerText;
            if (tag) { tags.push(tag); }
        }
    }


    console.log('tags: ' + tags);
    return tags;
}

function hyGetUrl() {
    const url = document.getElementById('submissionImg').src;
    console.log('url: ' + url);
    return url;
}

function hyPost() {
    chrome.runtime.sendMessage({
        action: 'hydrusAPI',
        method: '/add_urls/add_url',
        data: JSON.stringify({
            url: hyGetUrl(),
            //destination_page_key: 1,
            destination_page_name: 'furaffinity',
            show_destination_page: false,
            //service_keys_to_additional_tags
            filterable_tags: hyGetTags()
        })
    }, function (responseText) {
        console.log(responseText);
        
        hyButton.innerHTML = '[ ' + responseText + ' ] ';
    });

    hyButton.removeEventListener('click', hyPost, true);
}

const hyButton = document.createElement("span");
const insertButton = document.getElementsByClassName('cat')[0];
const inserted = insertButton.prepend(hyButton);
hyButton.innerHTML = '[ <a href="javascript:void(0);">Send to Hydrus</a> ] ';
hyButton.addEventListener('click', hyPost, true);
