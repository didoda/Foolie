let commentSetup;
let commentsIndexBuffer;

function rss(_url) {
    $.ajax({
        url: 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(_url),
        dataType: 'json',
        success: function (data) {
            commentsIndexBuffer = [];
            if (data.feed && data.items) {
                let i = Math.floor(Math.random() * data.items.length);
                readAndWrite(data.items[i]);
            }
        }
    });
}

function randomComments() {
    let comments = [];
    for (let i=0; i<config.maxComments; i++) {
        let comment;
        let k = 0;
        do {
            comment = config.comments[Math.floor(Math.random() * config.comments.length)];
            condition = jQuery.inArray(comment, comments) >= 0;
            k++;
            if (k > 10) {
                condition = false;
            }
        } while (condition);
        comments[i] = comment;
    }

    return comments;
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
    const comments = randomComments();
    for (let i=0; i<comments.length; i++) {
        Favella.setup(randomSetup());
        Favella.speak(comments[i],{
            onstart: function(e) {
                $('#speaker').append(`&nbsp;<b style="color: ${config.colors[i]}">${comments[i]}</b>`);
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