<template>
  <div class="app">
    
    <header class="header">
      <h1>🎬 Nenetflixan</h1>
      <p class="subtitle">Koleksi video lokal dengan Vue</p>
    </header>
    <main>
      <VideoList />
    </main>
  </div>
</template>

<script setup>
import VideoList from '../components/VideoList.vue'
</script>

<style>
/* GLOBAL STYLES (tidak scoped) */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, Roboto, 'Helvetica Neue', sans-serif;
  background-color: #0a0a0a;
  color: #f0f0f0;
  line-height: 1.5;
}

.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
}

.header {
  margin-bottom: 2rem;
  padding-left: 1rem;
}

.header h1 {
  font-size: 2.5rem;
  font-weight: bold;
  color: #e50914;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #aaa;
  font-size: 0.95rem;
  border-left: 2px solid #e50914;
  margin-top: 0.25rem;
  padding-left: 1rem;
}
</style>