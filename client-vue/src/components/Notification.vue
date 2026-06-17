<template>
  <Teleport to="body">
    <div v-if="visible" class="notification" @click="dismiss">
      {{ message }}
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps({
  message: String,
  duration: {
    type: Number,
    default: 5000
  },
  key: {
    type: Number,
    default: 0
  }
})

const visible = ref(false)
let timer = null

const show = () => {
  // Hapus timer lama jika ada
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  visible.value = true
  // Set timer untuk hilang
  timer = setTimeout(() => {
    visible.value = false
    timer = null
  }, props.duration)
}

const dismiss = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  visible.value = false
}

// Trigger setiap kali key berubah (artinya ada notifikasi baru)
watch(() => props.key, () => {
  if (props.message) {
    show()
  }
}, { immediate: true })

// Bersihkan timer saat unmount
onUnmounted(() => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
})
</script>

<style scoped>
.notification {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #1a1a1a;
  color: #fff;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  z-index: 9999;
  font-family: system-ui, sans-serif;
  font-size: 1rem;
  border: 1px solid #333;
  min-width: 200px;
  text-align: center;
  cursor: pointer;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
</style>