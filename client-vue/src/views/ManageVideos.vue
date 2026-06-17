<template>
  <div class="manage-container">
    <div class="manage-header">
      <h1>📋 Manage Videos</h1>
      <button @click="openAddModal" class="btn-add">+ Tambah Video</button>
    </div>

    <div class="table-container">
      <div v-if="loading" class="loading-state">Memuat data...</div>
      <div v-else-if="videos.length === 0" class="empty-state">
        <p>Belum ada video. Tambahkan video sekarang!</p>
      </div>
      <table v-else>
        <thead>
          <tr>
            <th>ID</th>
            <th>Judul</th>
            <th>Tipe</th>
            <th>Genre</th>
            <th>Tahun</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="video in videos" :key="video.id">
            <td>{{ video.id }}</td>
            <td>{{ video.title }}</td>
            <td>{{ video.type === 'movie' ? '🎬 Film' : '📺 Series' }}</td>
            <td>{{ video.genre || '-' }}</td>
            <td>{{ video.year || '-' }}</td>
            <td>
              <button @click="openEditModal(video)" class="btn-edit" title="Edit">✏️</button>
              <button @click="deleteVideo(video.id)" class="btn-delete" title="Hapus">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <VideoFormModal
      :show="showModal"
      :video="editingVideo"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import VideoFormModal from '../components/VideoFormModal.vue'

const videos = ref([])
const loading = ref(true)
const showModal = ref(false)
const editingVideo = ref(null)

const fetchVideos = async () => {
  loading.value = true
  try {
    const res = await fetch('/api/videos')
    videos.value = await res.json()
  } catch (err) {
    console.error('Gagal fetch data:', err)
  } finally {
    loading.value = false
  }
}

const openAddModal = () => {
  editingVideo.value = null
  showModal.value = true
}

const openEditModal = (video) => {
  editingVideo.value = { ...video }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingVideo.value = null
}

const handleSubmit = async (data) => {
  const isEdit = !!data.id
  const url = isEdit ? `/api/videos/${data.id}` : '/api/videos'
  const method = isEdit ? 'PUT' : 'POST'

  // Data tanpa file (file diupload terpisah nanti)
  const payload = {
    title: data.title,
    type: data.type,
    genre: data.genre,
    year: data.year,
    country: data.country,
    duration: data.duration,
    description: data.description,
    file_path: data.file_path,
    // poster_path dan bg_path tetap dipertahankan jika ada
    poster_path: data.poster_path,
    bg_path: data.bg_path,
  }

  try {
    // 1. Kirim data video
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const errorData = await res.json()
      alert('Error: ' + (errorData.error || 'Gagal menyimpan video'))
      return
    }

    const result = await res.json()
    const videoId = isEdit ? data.id : result.id

    // 2. Upload poster jika ada
    if (data.posterFile) {
      const formData = new FormData()
      formData.append('poster', data.posterFile)
      await fetch(`/api/videos/${videoId}/upload-poster`, {
        method: 'POST',
        body: formData,
      })
    }

    // 3. Upload background jika ada
    if (data.bgFile) {
      const formData = new FormData()
      formData.append('bg', data.bgFile)
      await fetch(`/api/videos/${videoId}/upload-bg`, {
        method: 'POST',
        body: formData,
      })
    }

    // 4. Refresh data dan tutup modal
    await fetchVideos()
    closeModal()
  } catch (err) {
    console.error(err)
    alert('Terjadi kesalahan: ' + err.message)
  }
}

const deleteVideo = async (id) => {
  if (!confirm('Yakin ingin menghapus video ini?')) return

  try {
    const res = await fetch(`/api/videos/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const error = await res.json()
      alert('Error: ' + (error.error || 'Gagal hapus video'))
      return
    }
    await fetchVideos()
  } catch (err) {
    alert('Terjadi kesalahan: ' + err.message)
  }
}

onMounted(fetchVideos)
</script>

<style scoped>
.manage-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.manage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.manage-header h1 {
  font-size: 2rem;
  color: #fff;
}

.btn-add {
  background: #e50914;
  color: white;
  border: none;
  padding: 0.7rem 1.5rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #f40612;
}

.table-container {
  background: #111;
  border-radius: 12px;
  overflow-x: auto;
  padding: 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  border-bottom: 2px solid #333;
}

th {
  padding: 0.8rem 1rem;
  text-align: left;
  color: #aaa;
  font-weight: 500;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

td {
  padding: 0.8rem 1rem;
  border-bottom: 1px solid #222;
  color: #eee;
}

tr:hover td {
  background: #1a1a1a;
}

.btn-edit,
.btn-delete {
  border: none;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.3rem;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.btn-edit {
  background: #2c5282;
  color: white;
}

.btn-edit:hover {
  opacity: 0.8;
}

.btn-delete {
  background: #9b2c2c;
  color: white;
}

.btn-delete:hover {
  opacity: 0.8;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #888;
}

.empty-state p {
  font-size: 1.1rem;
}
</style>