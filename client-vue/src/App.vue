<template>
  <div>
    <Header @search="handleSearch" />
    <router-view :searchQuery="searchQuery" />
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
import { ref } from 'vue'

const searchQuery = ref('')
const handleSearch = (query) => {
  searchQuery.value = query
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, sans-serif;
  background-color: #0a0a0a;
  color: #f0f0f0;
}
</style>