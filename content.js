
function getTags() {
    var tags = [];
    tags.push('site:furaffinity');
    tags.push('import:' + new Date().toISOString());
    tags.push('importer:fahy');
    tags.push('importer:https://github.com/femtoAmpere/fahy');

    const pageUrl = window.location.href.endsWith('/') ? window.location.href : window.location.href + '/';
    tags.push('url:' + pageUrl);
    tags.push('id:' + pageUrl.split('/').at(-2));

    const downloadUrl = getUrl();
    tags.push('url:' + downloadUrl);

    const filename = downloadUrl.split(/(\\|\/)/g).pop();
    tags.push('filename:' + filename);
    tags.push('extension:' + filename.split('.').at(-1));
    tags.push('faid:' + filename.split('.').at(0));

    const submissionInfos = document.getElementsByClassName('classic-submission-title information')[0];
    tags.push('title:' + submissionInfos.firstElementChild.innerText);
    tags.push('creator:' + submissionInfos.lastElementChild.innerText);
    tags.push('url:https://furaffinity.net/user/' + submissionInfos.lastElementChild.innerText + '/');

    const foldersElement = document.getElementsByClassName('clearfloat')
    if (foldersElement.length > 0) {
        const folders = foldersElement[0].getElementsByTagName('li');
        for (const a of folders) {
            tags.push('url:' + a.firstElementChild.href);
            tags.push('folder:' + a.innerText);
        }
    }

    const statsContainer = document.getElementsByClassName('alt1 stats-container')[0];
    const stats = statsContainer.getElementsByTagName('b');
    for (const a of stats)
    {
        var thisText = a.innerText;
        switch (thisText) {
            case undefined:
                break;
            case 'Submission Information:':
                break;
            case 'Posted:':
                tags.push(thisText + a.nextElementSibling.title);
                tags.push(thisText + a.nextElementSibling.innerText);
                break;
            case 'Image Specifications:':
                break;
            case 'Favorites:':
                tags.push(thisText + a.nextElementSibling.innerText);
                break;
            case 'Keywords:':
                break;
            default:
                tags.push(thisText + a.nextSibling.textContent);
        }
    }

    const ratingBadge = statsContainer.lastElementChild;
    const rating = ratingBadge.firstElementChild.alt;
    switch (rating)
    {
        case 'Adult rating':
            tags.push('rating:explicit');
            break;
        case 'Mature rating':
            tags.push('rating:questionable');
            break;
        case 'General rating':
            tags.push('rating:safe');
            break;
        default:
            break;
    }

    const keywords = document.getElementById('keywords');
    if (keywords) {
        const htmlTags = keywords.getElementsByTagName('a');
        for (const a of htmlTags) {
            var tag = a.innerText;
            if (tag) { tags.push(tag); }
        }
    }


    console.log('tags: ' + tags);
    return tags;
}

function getUrl() {
    const url = document.getElementById('submissionImg').src;
    console.log('url: ' + url);
    return url;
}

function getUrlsFromTags(tags)
{
    var urls = [];
    for (const tag of tags)
    {
        if (tag.toLowerCase().startsWith('url:'))
        {
            urls.push(tag.split('url:')[1]);
        }
    }

    console.log('urls: ' + urls);
    return urls;
}

function getComment()
{
    const commentElement = document.getElementsByClassName('maintable')[1].getElementsByTagName('tr')[2];

    return commentElement.innerText;
}

async function hyPost() 
{
    hyButton.removeEventListener('click', hyPost, true);
    hyButton.innerHTML = '[ ' + 'faHy Importing' + ' ] ';

    const importUrl = getUrl();
    const tags = getTags();
    const urls = getUrlsFromTags(tags);
    const notes = 
    {
        //'source': window.location.href.endsWith('/') ? window.location.href : window.location.href + '/',
        'artist description': getComment(),
    };

    chrome.runtime.sendMessage({
        action: 'hydrusAPI',
        importUrl: importUrl,
        tags: tags,
        urls: urls,
        notes: notes
    }, function (responseText) {
        console.log(responseText);

        hyButton.innerHTML = '[ ' + responseText + ' ] ';
    });
}

const hyButton = document.createElement("span");
const insertButton = document.getElementById('page-submission').getElementsByClassName('maintable')[0].getElementsByClassName('cat')[0];
const inserted = insertButton.prepend(hyButton);
hyButton.innerHTML = '[ <a href="javascript:void(0);">Send to Hydrus</a> ] ';
hyButton.addEventListener('click', hyPost, true);
