<script setup>
import FoolieRssReader from './components/FoolieRssReader.vue'

</script>

<template>

  <div>

    <h1>Hi. This is Foolie</h1>

    <p>Switch on your audio and enjoy</p>

    <FoolieRssReader url="https://www.newyorker.com/feed/news" />

  </div>

</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
