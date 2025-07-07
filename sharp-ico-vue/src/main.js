import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/theme-chalk/dark/css-vars.css';
// 由于使用了自动导入，不需要手动导入 Element Plus
// Element Plus 会通过 unplugin-auto-import 和 unplugin-vue-components 自动导入

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, vm, info) => {
  console.error('Global error:', err)
  console.error('Component info:', info)
}

// 全局警告处理
app.config.warnHandler = (msg, vm, trace) => {
  if (import.meta.env.DEV) {
    console.warn('Vue warning:', msg)
    console.warn('Component trace:', trace)
  }
}

// 全局属性
app.config.globalProperties.$appVersion = import.meta.env.VITE_APP_VERSION || '1.4.0'
app.config.globalProperties.$appName = import.meta.env.VITE_APP_TITLE || 'Sharp ICO'

// 性能监控
if (import.meta.env.DEV) {
  app.config.performance = true
}

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
