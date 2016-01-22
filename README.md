# Foolie
A dummy html page that reads rss feeds using Favella (text-to-speech javascript library)

**Foolie** reads your rss feeds using **Favella** (https://github.com/batopa/favella) and comments them randomly (random comments and random 'voices').
It's basically a standalone html page, with some javascript and css files.

## Download

Download the [latest release](https://github.com/didoda/foolie/releases) in your localhost web folder (i.e.: /var/www/foolie).

## Config

Edit ```js/config.js``` to personalise your settings: rssUrl, lang, comments, maxComments, speakerSetup.
```
var config = {
    rssUrl: 'http://www.newyorker.com/feed/news',
    lang: 'en-GB',
    comments: [
        'Really?',
        'No way',
        'Oh my God!',
        'Are you kidding me?',
        'I can\'t believe it',
        'Disgusting',
        'Oh yeah',
        'Remarkable',
        'Are you serious or what?'
    ],
    maxComments: 3,
    speakerSetup: { // favella setup
        parentalControl: false,
        speakOptions: {
            volume: 1,
            rate: 1,
            pitch: 1,
            lang: 'en-GB'
        }
    }
};
```

## Enjoy

Open with google chrome your Foolie (i.e. http://localhost/foolie).
Edit again js/config.js to add funny comments or to change rss feed url or lang, etc.

## Thanks to 

### Favella!

Do you know Favella (https://github.com/batopa/favella)?
Favella is a cool javascript library that provides a text-to-speech service; it's developed by https://github.com/batopa.

Have fun with Favella!
Thanks to Favella and to batopa.

### jquery

Foolie uses JQuery 1.11.3 (https://jquery.com/).

### googleapis

Foolie uses googleapis services to obtain feed data (https://developers.google.com/speed/libraries/).