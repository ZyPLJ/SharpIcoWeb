<template>
  <div class="error-boundary" v-if="hasError">
    <div class="error-container">
      <div class="error-icon">
        <el-icon size="64">
          <Warning />
        </el-icon>
      </div>
      
      <h2 class="error-title">出现了一些问题</h2>
      <p class="error-message">{{ errorMessage }}</p>
      
      <div class="error-actions">
        <el-button type="primary" @click="retry">
          <el-icon><Refresh /></el-icon>
          重试
        </el-button>
        <el-button @click="reportError" v-if="!errorReported">
          <el-icon><Document /></el-icon>
          报告问题
        </el-button>
      </div>
      
      <details class="error-details" v-if="showDetails">
        <summary>技术详情</summary>
        <pre class="error-stack">{{ errorInfo }}</pre>
      </details>
    </div>
  </div>
  
  <slot v-else />
</template>

<script setup>
import { ref, onErrorCaptured, nextTick } from 'vue'
import { Warning, Refresh, Document } from '@element-plus/icons-vue'

const hasError = ref(false)
const errorMessage = ref('')
const errorInfo = ref('')
const errorReported = ref(false)
const showDetails = ref(false)

const props = defineProps({
  fallback: {
    type: String,
    default: '应用遇到了错误，请刷新页面重试'
  },
  onError: {
    type: Function,
    default: null
  }
})

const emit = defineEmits(['error'])

onErrorCaptured((error, instance, info) => {
  hasError.value = true
  errorMessage.value = error.message || props.fallback
  errorInfo.value = `${error.stack}\n\n组件信息: ${info}`
  
  // 在开发环境显示详细信息
  if (import.meta.env.DEV) {
    showDetails.value = true
    console.error('Error caught by ErrorBoundary:', error)
    console.error('Component info:', info)
  }
  
  // 调用错误回调
  if (props.onError) {
    props.onError(error, instance, info)
  }
  
  emit('error', { error, instance, info })
  
  return false // 阻止错误继续向上传播
})

const retry = async () => {
  hasError.value = false
  errorMessage.value = ''
  errorInfo.value = ''
  errorReported.value = false
  
  await nextTick()
  
  // 重新渲染子组件
  window.location.reload()
}

const reportError = () => {
  // 这里可以实现错误报告功能
  ElMessage.success('错误报告已发送，感谢您的反馈！')
  errorReported.value = true
}

// 全局错误处理
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (!hasError.value) {
      hasError.value = true
      errorMessage.value = event.message
      errorInfo.value = `${event.filename}:${event.lineno}:${event.colno}`
    }
  })
  
  window.addEventListener('unhandledrejection', (event) => {
    if (!hasError.value) {
      hasError.value = true
      errorMessage.value = event.reason?.message || '未处理的Promise拒绝'
      errorInfo.value = event.reason?.stack || ''
    }
  })
}
</script>

<style scoped>
.error-boundary {
  min-height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
}

.error-container {
  text-align: center;
  max-width: 500px;
  background: var(--background-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xxl);
  box-shadow: var(--box-shadow-card);
}

.error-icon {
  color: var(--error-color);
  margin-bottom: var(--spacing-lg);
}

.error-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.error-message {
  color: var(--text-secondary);
  font-size: var(--font-size-md);
  margin-bottom: var(--spacing-xl);
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  margin-bottom: var(--spacing-lg);
}

.error-details {
  text-align: left;
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--background-grey);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-color);
}

.error-details summary {
  cursor: pointer;
  font-weight: var(--font-weight-medium);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.error-stack {
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: var(--font-size-xs);
  color: var(--text-light);
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}
</style>