<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDark, usePreferredDark } from '@vueuse/core'
import SharpIco from './components/SharpIco.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import ErrorBoundary from './components/ErrorBoundary.vue'
import { VERSION, buildNotifications } from '../notifications.js'
import {ElMessageBox, ElNotification} from 'element-plus';

const isDark = useDark()
const isSystemDarkMode = usePreferredDark()
const isLoading = ref(true)
const isDev = import.meta.env.DEV
const { t } = useI18n()

// 应用初始化
const initializeApp = async () => {
  try {
    // 检查版本更新
    checkVersionUpdate()
    
    // 设置主题
    initializeTheme()
    
    // 模拟加载时间（实际项目中可能是异步资源加载）
    await new Promise(resolve => setTimeout(resolve, 500))
    
  } catch (error) {
    console.error('App initialization failed:', error)
    ElMessage.error('应用初始化失败，请刷新页面重试')
  } finally {
    isLoading.value = false
  }
}

// 初始化主题
const initializeTheme = () => {
  // 如果用户没有设置过主题，使用系统偏好
  const savedTheme = localStorage.getItem('vueuse-color-scheme')
  if (!savedTheme) {
    isDark.value = isSystemDarkMode.value
  }
}

// 检查版本更新
const checkVersionUpdate = () => {
  ElNotification(buildNotifications(t).welcome)
  const lastVersion = localStorage.getItem('app_version')

  if (lastVersion !== VERSION) {
    localStorage.setItem('app_version', VERSION)

    // 如果是首次访问（无lastVersion）则不提示更新
    if (lastVersion) {
      showUpdateNotification()
    }
  }
}

// 更新提示函数
const showUpdateNotification = () => {
  ElMessageBox.confirm(t('messages.newVersion'), t('messages.tip'), {
    cancelButtonText: t('messages.later'),
    type: 'warning',
    showClose: false,
    showCancelButton: false,
    confirmButtonText: t('common.update')
  }).then(() => { 
    window.location.reload() 
  }).catch(() => {
    // 用户取消更新
  })
}

// 全局错误处理
const handleGlobalError = (errorInfo) => {
  console.error('App error boundary caught:', errorInfo)
  
  // 可以在这里发送错误报告到监控服务
  if (import.meta.env.PROD) {
    // reportErrorToService(errorInfo)
  }
}

// 键盘快捷键
const handleKeyboardShortcuts = (event) => {
  // Ctrl/Cmd + K 快速聚焦到上传区域
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    const uploadElement = document.querySelector('.el-upload')
    if (uploadElement) {
      uploadElement.focus()
    }
  }
  
  // Ctrl/Cmd + D 切换主题
  if ((event.ctrlKey || event.metaKey) && event.key === 'd') {
    event.preventDefault()
    isDark.value = !isDark.value
  }
}

// 生命周期
onMounted(() => {
  initializeApp()
  
  // 注册键盘快捷键
  document.addEventListener('keydown', handleKeyboardShortcuts)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcuts)
})
</script>

<template>
  <div :class="{ dark: isDark }" class="app-container">
    <!-- 加载屏幕 -->
    <div v-if="isLoading" class="loading-screen">
      <div class="loading-content">
        <div class="loading-logo">
          <div class="logo-ring"></div>
          <div class="logo-icon">ICO</div>
        </div>
        <h1>{{ $t('app.name') }}</h1>
        <p>{{ $t('app.loading') }}</p>
      </div>
    </div>
    
    <!-- 主应用 -->
    <template v-else>
      <!-- 主要内容 -->
      <ErrorBoundary @error="handleGlobalError">
        <main class="main-content">
          <SharpIco />
        </main>
      </ErrorBoundary>
      
      <!-- 快捷键提示（开发环境） -->
      <div v-if="isDev" class="dev-shortcuts">
        <details>
          <summary>{{ $t('dev.shortcuts') }}</summary>
          <ul>
            <li><kbd>Ctrl</kbd> + <kbd>K</kbd> - {{ $t('dev.focusUpload') }}</li>
            <li><kbd>Ctrl</kbd> + <kbd>D</kbd> - {{ $t('dev.toggleTheme') }}</li>
          </ul>
        </details>
      </div>
    </template>
    <LanguageSwitcher />
  </div>
</template>

<style>
@import './assets/styles/theme.css';

.app-container {
  min-height: 100vh;
  transition: var(--transition);
  background: var(--color-background);
  color: var(--color-text);
}

.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  text-align: center;
  animation: fadeIn 0.5s ease-out;
}

.loading-logo {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid var(--primary-light);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.logo-icon {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--primary-color);
}

.loading-content h1 {
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.loading-content p {
  color: var(--text-secondary);
  font-size: var(--font-size-md);
}

.main-content {
  position: relative;
  z-index: 1;
}

.dev-shortcuts {
  position: fixed;
  bottom: var(--spacing-md);
  left: var(--spacing-md);
  z-index: 99;
  background: var(--background-overlay);
  backdrop-filter: var(--blur-background);
  border-radius: var(--border-radius);
  padding: var(--spacing-sm);
  font-size: var(--font-size-xs);
  border: 1px solid var(--border-color);
}

.dev-shortcuts summary {
  cursor: pointer;
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.dev-shortcuts ul {
  margin: var(--spacing-sm) 0 0;
  padding-left: var(--spacing-md);
  list-style: none;
}

.dev-shortcuts li {
  margin-bottom: var(--spacing-xs);
  color: var(--text-light);
}

.dev-shortcuts kbd {
  background: var(--background-grey);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-sm);
  padding: 2px 6px;
  font-size: var(--font-size-xs);
  font-family: monospace;
  margin: 0 2px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 无障碍支持 */
@media (prefers-reduced-motion: reduce) {
  .logo-ring {
    animation: none;
  }
  
  .loading-content,
  .main-content {
    animation: none;
  }
  
  * {
    transition: none !important;
    animation: none !important;
  }
}

/* 打印样式 */
@media print {
  .dev-shortcuts,
  .theme-toggle-container {
    display: none !important;
  }
  
  .app-container {
    background: white !important;
    color: black !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: custom) {
  .app-container {
    --primary-color: #0066cc;
    --text-primary: #000000;
    --text-secondary: #333333;
    --border-color: #666666;
    --background-light: #ffffff;
    --background-grey: #f0f0f0;
  }
}
</style>