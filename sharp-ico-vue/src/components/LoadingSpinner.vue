<template>
  <div class="loading-spinner" v-if="show">
    <div class="spinner-backdrop" @click="onBackdropClick">
      <div class="spinner-container">
        <div class="spinner">
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
          <div class="spinner-ring"></div>
        </div>
        <p class="loading-text" v-if="text">{{ text }}</p>
        <div class="progress-bar" v-if="showProgress">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  text: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0
  },
  showProgress: {
    type: Boolean,
    default: false
  },
  backdrop: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['backdrop-click'])

const onBackdropClick = (e) => {
  if (e.target === e.currentTarget && props.backdrop) {
    emit('backdrop-click')
  }
}
</script>

<style scoped>
.loading-spinner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--background-overlay);
  backdrop-filter: var(--blur-background);
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-container {
  background: var(--background-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 200px;
}

.spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
  border-top-color: var(--secondary-color);
  animation-delay: -0.3s;
  animation-duration: 1.2s;
}

.spinner-ring:nth-child(3) {
  border-top-color: var(--accent-color);
  animation-delay: -0.6s;
  animation-duration: 1.5s;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  margin-top: var(--spacing-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background: var(--border-light);
  border-radius: 2px;
  margin-top: var(--spacing-md);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  border-radius: 2px;
  transition: width 0.3s ease;
}
</style>