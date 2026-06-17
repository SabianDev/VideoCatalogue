<template>
  <header class="app-header">
    <div class="logo">
      <router-link to="/">Nenetflixan</router-link>
    </div>
    <nav class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/series">Series</router-link>
      <router-link to="/movies">Movies</router-link>
      <router-link to="/favorites">Favorites</router-link>
    </nav>
    <div class="search-bar">
      <input
        type="text"
        placeholder="Search..."
        v-model="searchQuery"
        @input="emitSearch"
      />
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const emit = defineEmits(['search'])

const emitSearch = () => {
  emit('search', searchQuery.value)
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 2rem;
  background-color: #0a0a0a;
  border-bottom: 1px solid #333;
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo a {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e50914;
  text-decoration: none;
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #f0f0f0;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #e50914;
}

.search-bar input {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid #333;
  background-color: #1a1a1a;
  color: white;
  width: 220px;
  outline: none;
  transition: 0.2s;
}

.search-bar input:focus {
  border-color: #e50914;
}
</style>