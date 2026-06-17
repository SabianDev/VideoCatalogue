<template>
  <div class="detail-page" v-if="video">
    <div class="detail-card">
      <!-- Hero dengan img absolute -->
      <div class="hero">
        <img class="hero-bg" :src="getBackgroundUrl(video.bg_path)" :alt="video.title" />
        <div class="overlay"></div>
        <div class="content-bottom-left">
          <h1 class="title">{{ video.title }}</h1>
          <div class="meta">
            <span>{{ video.type === 'movie' ? 'Film' : 'Series' }}</span>
            <span v-if="video.year"> • {{ video.year }}</span>
            <span v-if="video.country"> • {{ video.country }}</span>
            <span> • {{ formatDuration(video.duration) }}</span>
          </div>
          <div class="description">
            <p>{{ displayedDescription }}</p>
            <button v-if="isLongDescription" @click="toggleDescription" class="read-more-btn">
              {{ showFullDescription ? 'Read less' : 'Read more' }}
            </button>
          </div>
          <div class="actions-left">
            <button @click="playVideo" class="play-btn">▶ Play</button>
            <button @click="toggleFavorite" class="fav-btn">
              {{ isFavorite ? '⭐ Remove from favorites' : '☆ Add to favorites' }}
            </button>
          </div>
        </div>
        <div class="content-bottom-right">
          <button @click="editVideo" class="edit-btn">✏ Edit</button>
          <button @click="deleteVideo" class="delete-btn">🗑 Delete</button>
        </div>
      </div>

      
    </div>

    <button @click="$router.back()" class="back-btn">← Back</button>
  </div>
  <div v-else class="loading">Loading...</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { injectNotification } from '../composables/useNotification'

const { showNotification } = injectNotification()
const route = useRoute()
const router = useRouter()
const video = ref(null)
const showFullDescription = ref(false)
const isFavorite = ref(false)

const fetchVideo = async () => {
  const id = route.params.id
  const res = await fetch(`/api/videos/${id}`)
  video.value = await res.json()
}

const getBackgroundUrl = (bgPath) => {
  if (!bgPath) return 'https://placehold.co/1200x600/1a1a1a/666?text=No+Background'
  return `/thumbnails/${bgPath}`
}

const formatDuration = (seconds) => {
  if (!seconds) return '?'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

const displayedDescription = computed(() => {
  if (!video.value?.description) return 'Tidak ada sinopsis.'
  if (showFullDescription.value) return video.value.description
  if (video.value.description.length > 200) {
    return video.value.description.slice(0, 200) + '...'
  }
  return video.value.description
})

const isLongDescription = computed(() => {
  return video.value?.description && video.value.description.length > 200
})

const toggleDescription = () => {
  showFullDescription.value = !showFullDescription.value
}

const playVideo = async () => {
  const id = route.params.id
  const res = await fetch(`/api/play/${id}`, { method: 'POST' })
  const data = await res.json()
  if (res.ok) {
    showNotification(data.message || 'Memutar video...')
  } else {
    showNotification('Error: ' + (data.error || 'Gagal memutar video'), 3000)
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
}

const editVideo = () => {
  alert('Fitur edit akan segera hadir (modal atau halaman edit)')
}

const deleteVideo = async () => {
  if (confirm('Yakin ingin menghapus video ini?')) {
    alert('Fitur hapus akan segera hadir')
  }
}

onMounted(fetchVideo)
</script>

<style scoped>
.detail-page {
  background-color: #0a0a0a;
  padding: 2rem; /* ruang di sekeliling card */
  min-height: 100vh;
}

.detail-card {
  max-width: 1400px;
  margin: 0 auto;
  border-radius: 24px;
  overflow: hidden;
  background-color: #111;
  box-shadow: 0 8px 20px rgba(0,0,0,0.5);
}

.hero {
  position: relative;
  width: 100%;
  height: 70vh;
  overflow: hidden;
  background-color: #1a1a1a;
}

.hero-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  z-index: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(0deg, rgba(10,10,10,0.9) 0%, rgba(10,10,10,0.4) 60%, rgba(10,10,10,0.2) 100%);
  z-index: 1;
  pointer-events: none;
}

.content-bottom-left {
  position: absolute;
  bottom: 2rem;
  left: 2rem;
  max-width: 60%;
  z-index: 2;
}

.content-bottom-right {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
  z-index: 2;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}

.meta {
  font-size: 1rem;
  color: #ddd;
  margin-bottom: 1rem;
}

.description {
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  color: #eee;
  max-width: 600px;
  text-shadow: 1px 1px 2px black;
}

.read-more-btn {
  background: none;
  border: none;
  color: #e50914;
  cursor: pointer;
  font-weight: bold;
  padding: 0;
  margin-top: 0.5rem;
}

.actions-left {
  display: flex;
  gap: 1rem;
}

.play-btn, .fav-btn, .edit-btn, .delete-btn {
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}

.play-btn {
  background: #e50914;
  color: white;
}
.play-btn:hover {
  background: #f40612;
}

.fav-btn {
  background: #333;
  color: white;
}
.fav-btn:hover {
  background: #444;
}

.edit-btn {
  background: #2c5282;
  color: white;
}
.delete-btn {
  background: #9b2c2c;
  color: white;
}

.back-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  background: rgba(0,0,0,0.6);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  z-index: 10;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: white;
}

.debug-info {
  margin: 1rem;
  padding: 1rem;
  background: #222;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .detail-page {
    padding: 1rem;
  }
  .content-bottom-left {
    max-width: 90%;
    bottom: 1rem;
    left: 1rem;
  }
  .title {
    font-size: 2rem;
  }
  .content-bottom-right {
    bottom: 1rem;
    right: 1rem;
  }
}
</style>