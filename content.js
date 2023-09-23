
function hyGetTags() {
    var tags = [];
    tags.push('site:furaffinity');

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
        
        hyButton.innerHTML = '<h2>[ ' + responseText + ' ]</h2>';
    });

    hyButton.removeEventListener('click', hyPost, true);
}

const hyButton = document.createElement("p");
const insertButton = document.getElementById('page-submission');
const inserted = insertButton.prepend(hyButton);
hyButton.innerHTML = '<h2>[ hydrus ]</h2>';
hyButton.addEventListener('click', hyPost, true);
