<template>
  <div class="video-container">
    <!-- Loading state -->
    <div v-if="loading" class="state-message">
      <div class="spinner"></div>
      <p>Memuat koleksi video...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="state-message error">
      <p>⚠️ {{ error }}</p>
      <button @click="loadVideos" class="retry-btn">Coba Lagi</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="videos.length === 0" class="state-message">
      <p>📭 Belum ada video. Tambahkan melalui endpoint POST /api/videos</p>
    </div>

    <!-- Grid video (hanya tampil jika tidak loading, tidak error, dan tidak kosong) -->
    <div v-else class="video-grid">
      <div v-for="video in videos" :key="video.id" class="video-card">
        <!-- Poster container -->
        <div class="poster-container">
          <img
            :src="getPosterUrl(video.poster_path)"
            :alt="video.title"
            class="video-poster"
            @error="handleImageError"
          />
        </div>

        <div class="card-content">
          <span class="video-badge">{{ video.type === 'movie' ? '🎬 Film' : '📺 Series' }}</span>
          <h3 class="video-title">{{ video.title }}</h3>
          <p class="video-year">{{ video.year || 'Tahun tidak diketahui' }}</p>
          <p class="video-country">Negara : {{ video.country || 'Negara tidak diketahui' }}</p>
          <p class="video-genre">{{ video.genre || 'Tanpa genre' }}</p>
          <p class="video-duration">{{ formatDuration(video.duration) }}</p>
          <button @click="playVideo(video.id)" class="play-btn">▶ Putar di VLC</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { injectNotification } from '../composables/useNotification'

const { showNotification } = injectNotification()
const videos = ref([])
const loading = ref(true)
const error = ref(null)
const getPosterUrl = (posterPath) => {
  if (!posterPath) {
    // Bisa pakai placeholder default jika belum ada poster
    return 'https://placehold.co/400x225/333333/666666?text=No+Poster';
  }
  // Pastikan ini sesuai dengan path statis yang disediakan Express
  return `http://localhost:3000/thumbnails/${posterPath}`;
}

const handleImageError = (e) => {
  e.target.src = 'https://placehold.co/400x225/333333/666666?text=Image+Error';
}

// Format durasi dari detik ke jam/menit
function formatDuration(seconds) {
  if (!seconds) return 'Durasi tidak diketahui'
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours} jam ${minutes} menit`
  }
  return `${minutes} menit`
}

// Panggil endpoint play
const playVideo = async (id) => {
  try {
    const response = await fetch(`/api/play/${id}`, { method: 'POST' })
    const data = await response.json()
    if (response.ok) {
      showNotification(data.message || 'Memutar video...')
    } else {
      showNotification('Error: ' + (data.error || 'Gagal memutar video'), 3000)
    }
  } catch (err) {
    showNotification('Gagal menghubungi server: ' + err.message, 3000)
  }
}

// Ambil daftar video dari backend
async function loadVideos() {
  loading.value = true
  error.value = null
  try {
    const res = await fetch('/api/videos')
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    videos.value = await res.json()
  } catch (err) {
    console.error(err)
    error.value = err.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadVideos()
})
</script>

<style scoped>
/* LOCAL STYLES (hanya untuk komponen ini) */

.poster-container {
  width: 100%;
  aspect-ratio: 16 / 9; /* Membuat container berbentuk persegi panjang */
  overflow: hidden; /* Menyembunyikan bagian gambar yang kelebihan */
  background-color: #2a2a2a;
}

.video-poster {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 🔥 Kunci agar gambar memenuhi container dan terlihat bagus */
  transition: transform 0.3s ease;
}

.video-card:hover .video-poster {
  transform: scale(1.05); /* Efek zoom saat hover */
}

.video-container {
  width: 100%;
}

.state-message {
  text-align: center;
  padding: 3rem;
  background: #111;
  border-radius: 12px;
  margin: 2rem 0;
}

.state-message.error {
  background: #2a0a0a;
  color: #ff8888;
}

.retry-btn {
  background: #e50914;
  border: none;
  color: white;
  padding: 0.5rem 1.2rem;
  margin-top: 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

.spinner {
  border: 4px solid #333;
  border-top: 4px solid #e50914;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.8rem;
  margin-top: 1rem;
}

.video-card {
  background: #1a1a1a;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  cursor: default;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.video-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.5);
  background: #222;
}

.card-content {
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.video-badge {
  display: inline-block;
  background: #e50914;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  width: fit-content;
  letter-spacing: 0.5px;
}

.video-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0.2rem 0;
  color: #ffffff;
  line-height: 1.3;
}

.video-genre {
  font-size: 0.85rem;
  color: #bbbbbb;
}

.video-duration {
  font-size: 0.8rem;
  color: #888888;
  margin-bottom: 0.3rem;
}

.play-btn {
  background: #e50914;
  border: none;
  color: white;
  font-weight: bold;
  padding: 0.6rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.play-btn:hover {
  background: #f40612;
}

.play-btn:active {
  transform: scale(0.97);
}
</style>