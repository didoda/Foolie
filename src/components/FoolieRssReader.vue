<script setup>
import Favella from 'favella';
import axios from 'axios'

defineProps({
  url: String,
  lang: {
    type: String,
    default: 'en-GB'
  }
})

init();

function init() {
  Favella.setup({
    parentalControl: false,
    speakOptions: {
      volume: 1,
      rate: 1,
      pitch: 1,
      lang: 'en-GB',
      mute: 'console'
    }
  });
}

async function readRss(url) {
  const response = await axios.get('https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(url));
  if (response.data.feed && response.data.items) {
    const config = {
      parentalControl: false,
      speakOptions: {
        volume: 1,
        rate: 1,
        pitch: 1,
        lang: document.getElementById('lang').value
      }
    };
    Favella.setup(config);
    for (let i = 0; i < response.data.items.length; i++) {
      let feed = response.data.items[i];
      await aloud(feed.title);
      await aloud(feed.content);
    }
  }

  return response;
}

async function aloud(content) {
  await Favella.speak(content, {
    onstart: function(e) {
      document.getElementById('text').innerHTML = `${content}`;
    }
  });
}

async function play() {
  if (Favella.isSpeaking()) {
    return;
  }
  display('play', false);
  display('pause', true);
  display('resume', false);
  display('stop', true);
  const url = document.getElementById('rssUrl').value;
  await readRss(url);
}

function pause() {
  if (Favella.isPaused()) {
    return;
  }
  Favella.pause();
  display('play', false);
  display('pause', false);
  display('resume', true);
  display('stop', true);
}

function resume() {
  Favella.resume();
  display('play', false);
  display('pause', true);
  display('resume', false);
  display('stop', true);
}

function stop() {
  if (!Favella.isSpeaking()) {
    return;
  }
  Favella.cancel();
  display('play', true);
  display('pause', false);
  display('resume', false);
  display('stop', false);
  document.getElementById('text').innerHTML = '';
}

function display(id, toggle) {
  if (toggle) {
    document.getElementById(id).classList.remove('hidden');
  } else {
    document.getElementById(id).classList.add('hidden');
  }
}
</script>

<template>

  <div>

    <input id="rssUrl" type="text" size="100" v-model="url" />

    <select id="lang" v-model="lang">
      <option value="en-GB">British English</option>
      <option value="en-US">US English</option>
      <option value="pt-BR">Português do Brazil</option>
      <option value="es-ES">Español</option>
      <option value="it-IT">Italiano</option>
    </select>

    <button id="play" type="button" @click="play">Play</button>
    <button id="pause" class="hidden" type="button" @click="pause">Pause</button>
    <button id="resume" class="hidden" type="button" @click="resume">Resume</button>
    <button id="stop" class="hidden" type="button" @click="stop">Stop</button>

    <div id="text"></div>

  </div>

</template>
