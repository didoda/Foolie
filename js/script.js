var commentSetup;

function rss(_url) {
    $.ajax({
        url: document.location.protocol + '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(_url),
        dataType: 'json',
        success: function (data) {
            if (data.responseData.feed && data.responseData.feed.entries) {
                readAndWrite(data.responseData.feed.entries[0]);
            }
        }
    });
}

function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

function randomComment(previousComments) {
    var comments = config.comments;
    var randomCommentNumber = Math.floor(Math.random() * comments.length);
    result = comments[randomCommentNumber];
    if (inArray(randomCommentNumber, previousComments)) {
        result = randomComment(previousComments);
    } else {
        previousComments.push(randomCommentNumber);
    }
    return result;
}

function randomSetup() {
    var randomRate = (1 + Math.floor(Math.random() * 50) / 100).toFixed(2); // 0.1 to 2
    var randomPitch = (Math.floor(Math.random() * 20) / 10).toFixed(2); // 0 to 2
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
            $('#speakerBubble').html(feed.title + ': ' + feed.contentSnippet);
        }
    });
    Favella.speak(feed.contentSnippet);
    Favella.setup(commentSetup);
    var numComments = config.maxComments;
    var comments = [];
    for (var i=0; i<numComments; i++) {
        Favella.setup(randomSetup());
        comment = randomComment(comments);
        Favella.speak(comment,{
            onstart: function(e) {
                $('#commentBubble').html($('#commentBubble').html() + "<br/>" + comment);
            }
        });
    }
}

$( document ).ready(function() {
    commentSetup = randomSetup();
    Favella.setup(config.speakerSetup);
    setTimeout(function() { // some seconds for speak
        rss(config.rssUrl);
    }, 5000);
});