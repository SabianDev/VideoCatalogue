import { ref, provide, inject } from 'vue'

const message = ref('')
const duration = ref(5000)
const key = ref(0) // tambahan untuk trigger

export function useNotification() {
  const showNotification = (msg, dur = 5000) => {
    message.value = msg
    duration.value = dur
    key.value++ // increment agar selalu trigger
  }

  return {
    message,
    duration,
    key,
    showNotification
  }
}

const notificationKey = Symbol('notification')

export function provideNotification() {
  const { message, duration, key, showNotification } = useNotification()
  provide(notificationKey, { message, duration, key, showNotification })
  return { message, duration, key, showNotification }
}

export function injectNotification() {
  const notification = inject(notificationKey)
  if (!notification) {
    throw new Error('Notification not provided.')
  }
  return notification
}