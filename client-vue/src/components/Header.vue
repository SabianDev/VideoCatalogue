<template>
  <header class="app-header" ref="headerRef">
    <div class="logo">
      <router-link to="/">Nenetflixan</router-link>
    </div>
    <nav class="nav-links">
      <router-link to="/">Home</router-link>
      <router-link to="/series">Series</router-link>
      <router-link to="/movies">Movies</router-link>
      <router-link to="/favorites">Favorites</router-link>

      <!-- Dropdown Manage - toggle-able -->
      <div class="dropdown" ref="dropdownRef">
        <button @click="toggleDropdown" class="dropdown-btn" :class="{ active: isDropdownOpen }">
          Manage <span class="arrow">▼</span>
        </button>
        <div v-if="isDropdownOpen" class="dropdown-menu">
          <router-link to="/manage/videos" class="dropdown-item" @click="closeDropdown">
            📋 Manage Videos
          </router-link>
          <router-link to="/options" class="dropdown-item" @click="closeDropdown">
            ⚙️ Options
          </router-link>
        </div>
      </div>
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
import { ref, onMounted, onUnmounted } from 'vue'

const searchQuery = ref('')
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)
const headerRef = ref(null)
const emit = defineEmits(['search'])

const toggleDropdown = (event) => {
  event.stopPropagation()
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = () => {
  isDropdownOpen.value = false
}

const handleClickOutside = (event) => {
  // Tutup dropdown jika klik di luar elemen dropdown (termasuk tombol)
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

const emitSearch = () => {
  emit('search', searchQuery.value)
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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
  align-items: center;
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

/* Dropdown */
.dropdown {
  position: relative;
}

.dropdown-btn {
  background: none;
  border: none;
  color: #f0f0f0;
  font-weight: 500;
  font-size: 1rem;
  font-family: inherit;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: color 0.2s;
  padding: 0.2rem 0;
}

.dropdown-btn:hover,
.dropdown-btn.active {
  color: #e50914;
}

.arrow {
  font-size: 0.7rem;
  transition: transform 0.2s;
}

.dropdown-btn.active .arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 2.2rem;
  left: 0;
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 0.5rem 0;
  min-width: 180px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.5);
  z-index: 200;
  animation: fadeIn 0.15s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.dropdown-item {
  display: block;
  padding: 0.5rem 1.2rem;
  color: #f0f0f0;
  text-decoration: none;
  transition: background 0.2s, color 0.2s;
}

.dropdown-item:hover {
  background: #333;
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

/* Responsive */
@media (max-width: 768px) {
  .app-header {
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
  }
  .nav-links {
    flex-wrap: wrap;
    gap: 1rem;
  }
  .search-bar input {
    width: 100%;
  }
}
</style>