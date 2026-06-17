<template>
  <div>
    <Header @search="handleSearch" />
    <router-view :searchQuery="searchQuery" />
    <Notification 
      :message="notificationMessage" 
      :duration="notificationDuration" 
      :key="notificationKey" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './components/Header.vue'
import Notification from './components/Notification.vue'
import { provideNotification } from './composables/useNotification'

const searchQuery = ref('')
const handleSearch = (query) => {
  searchQuery.value = query
}

const { 
  message: notificationMessage, 
  duration: notificationDuration, 
  key: notificationKey 
} = provideNotification()
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