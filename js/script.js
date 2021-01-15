let commentSetup;

function rss(_url) {
    $.ajax({
        url: 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(_url),
        dataType: 'json',
        success: function (data) {
            if (data.feed && data.items) {
                let i = Math.floor(Math.random() * data.items.length);
                readAndWrite(data.items[i]);
            }
        }
    });
}

function randomComment(previousComments) {
    let comments = config.comments;
    let k = 0;
    for (let i = 0; i < config.comments.length; i++) {
        if (jQuery.inArray(i, previousComments)) {
            continue;
        }
        comments[k++] = config.comments[i];
    }
    let n = Math.floor(Math.random() * comments.length);
    previousComments.push(n);

    return comments[n];
}

function randomSetup() {
    let randomRate = (1 + Math.floor(Math.random() * 50) / 100).toFixed(2); // 0.1 to 2
    let randomPitch = (Math.floor(Math.random() * 20) / 10).toFixed(2); // 0 to 2
    return {
        parentalControl: false,
        speakOptions: {
            volume: 1,
            rate: randomRate,
            pitch: randomPitch,
            lang: config.lang
        }
    };
}

function readAndWrite(feed) {
    Favella.setup(config.speakerSetup);
    Favella.speak(feed.title,{
        onstart: function(e) {
            $('#speaker').html(`<h1>${feed.title}</h1><section>${feed.content}</section><hr/>`);
        }
    });
    Favella.speak(feed.content);
    Favella.setup(commentSetup);
    let numComments = config.maxComments;
    let comments = [];
    for (let i=0; i<numComments; i++) {
        Favella.setup(randomSetup());
        let comment = randomComment(comments);
        Favella.speak(comment,{
            onstart: function(e) {
                $('#speaker').append(`&nbsp;<b style="color: ${config.colors[i]}">${comment}</b>`);
            }
        });
    }
}

$(document).ready(() => {
    $('#readRss').click(() => {
        commentSetup = randomSetup();
        Favella.setup(config.speakerSetup);
        rss(config.rssUrl);
    });
});