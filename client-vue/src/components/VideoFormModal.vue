<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h2>{{ isEdit ? 'Edit Video' : 'Tambah Video' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Judul *</label>
          <input v-model="form.title" required />
        </div>

        <div class="form-group">
          <label>Tipe *</label>
          <select v-model="form.type" required>
            <option value="movie">Film</option>
            <option value="series">Series</option>
          </select>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Genre</label>
            <input v-model="form.genre" />
          </div>
          <div class="form-group">
            <label>Tahun</label>
            <input v-model.number="form.year" type="number" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Negara</label>
            <input v-model="form.country" />
          </div>
          <div class="form-group">
            <label>Durasi (detik)</label>
            <input v-model.number="form.duration" type="number" />
          </div>
        </div>

        <div class="form-group">
          <label>Deskripsi</label>
          <textarea v-model="form.description" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label>File Path *</label>
          <input v-model="form.file_path" required placeholder="D:\\videos\\film.mp4" />
        </div>

        <div class="form-group">
          <label>Poster</label>
          <input type="file" @change="handlePosterUpload" accept="image/*" />
          <small v-if="form.poster_path">Current: {{ form.poster_path }}</small>
        </div>

        <div class="form-group">
          <label>Background</label>
          <input type="file" @change="handleBgUpload" accept="image/*" />
          <small v-if="form.bg_path">Current: {{ form.bg_path }}</small>
        </div>

        <div class="modal-actions">
          <button type="button" @click="close" class="btn-cancel">Batal</button>
          <button type="submit" class="btn-submit">Simpan</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  video: Object,
})

const emit = defineEmits(['close', 'submit'])

// ====== FORM STATE ======
const form = ref({
  title: '',
  type: 'movie',
  genre: '',
  year: null,
  country: '',
  duration: null,
  description: '',
  file_path: '',
  poster_path: null,
  bg_path: null,
})

const posterFile = ref(null)
const bgFile = ref(null)

const isEdit = computed(() => !!props.video)

// ====== RESET FORM (harus sebelum watch) ======
const resetForm = () => {
  form.value = {
    title: '',
    type: 'movie',
    genre: '',
    year: null,
    country: '',
    duration: null,
    description: '',
    file_path: '',
    poster_path: null,
    bg_path: null,
  }
  posterFile.value = null
  bgFile.value = null
}

// ====== WATCH untuk isi form saat edit ======
watch(() => props.video, (newVal) => {
  if (newVal) {
    form.value = {
      title: newVal.title || '',
      type: newVal.type || 'movie',
      genre: newVal.genre || '',
      year: newVal.year || null,
      country: newVal.country || '',
      duration: newVal.duration || null,
      description: newVal.description || '',
      file_path: newVal.file_path || '',
      poster_path: newVal.poster_path || null,
      bg_path: newVal.bg_path || null,
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// ====== HANDLER ======
const handlePosterUpload = (e) => {
  posterFile.value = e.target.files[0]
}

const handleBgUpload = (e) => {
  bgFile.value = e.target.files[0]
}

const handleSubmit = () => {
  const submitData = {
    ...form.value,
    posterFile: posterFile.value,
    bgFile: bgFile.value,
    id: props.video?.id,
  }
  emit('submit', submitData)
  posterFile.value = null
  bgFile.value = null
}

const close = () => {
  resetForm()
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: #1a1a1a;
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideUp 0.2s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  color: #fff;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.3rem;
  font-weight: 500;
  color: #ddd;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #333;
  background: #0a0a0a;
  color: white;
  border-radius: 6px;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #e50914;
}

.form-group small {
  display: block;
  margin-top: 0.2rem;
  color: #888;
  font-size: 0.8rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-cancel {
  background: #333;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #444;
}

.btn-submit {
  background: #e50914;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-submit:hover {
  background: #f40612;
}
</style>