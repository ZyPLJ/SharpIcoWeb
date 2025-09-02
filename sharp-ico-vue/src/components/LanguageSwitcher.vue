<template>
  <div class="lang-switcher-container">
    <el-dropdown trigger="click" @command="onChangeLocale">
      <button class="lang-switcher" aria-label="Switch language">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="M7.987 4.18a12.2 12.2 0 0 0-.669 2.32h5.364a12.2 12.2 0 0 0-.67-2.32c-.301-.733-.648-1.294-1.008-1.663C10.646 2.149 10.307 2 10 2s-.646.149-1.004.517c-.36.37-.707.93-1.009 1.663m-.096-1.899c-.314.426-.59.941-.828 1.518c-.32.78-.58 1.694-.762 2.701H2.804a8.02 8.02 0 0 1 5.087-4.219m4.219 0c.313.426.59.941.827 1.518c.32.78.58 1.694.762 2.701h3.497a8.02 8.02 0 0 0-5.087-4.219M17.602 7.5H13.85c.098.795.15 1.634.15 2.5s-.052 1.705-.15 2.5h3.752A8 8 0 0 0 18 10a8 8 0 0 0-.398-2.5m-.406 6h-3.497c-.182 1.007-.441 1.922-.762 2.7a7.2 7.2 0 0 1-.827 1.519a8.02 8.02 0 0 0 5.086-4.219M10 18c.307 0 .646-.149 1.004-.517c.36-.37.707-.93 1.008-1.663a12.2 12.2 0 0 0 .67-2.32H7.318c.168.873.397 1.657.67 2.32c.301.733.648 1.294 1.008 1.663c.358.368.697.517 1.004.517m-2.11-.281A8.02 8.02 0 0 1 2.805 13.5h3.497c.182 1.007.441 1.922.762 2.7c.237.578.514 1.093.828 1.519M2.399 12.5H6.15A21 21 0 0 1 6 10c0-.866.052-1.705.15-2.5H2.398A8 8 0 0 0 2 10c0 .873.14 1.713.398 2.5M7 10c0-.875.056-1.715.158-2.5h5.684c.102.785.158 1.625.158 2.5s-.056 1.714-.158 2.5H7.158A19 19 0 0 1 7 10"/></svg>
        <span class="label">{{ currentLangLabel }}</span>
      </button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="zh">{{ t('lang.zh') }}</el-dropdown-item>
          <el-dropdown-item command="en">{{ t('lang.en') }}</el-dropdown-item>
          <el-dropdown-item command="ja">{{ t('lang.ja') }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const onChangeLocale = (code) => {
  locale.value = code
  localStorage.setItem('locale', code)
}

const currentLangLabel = computed(() => {
  if (locale.value === 'zh') return t('lang.zh')
  if (locale.value === 'ja') return t('lang.ja')
  return t('lang.en')
})
</script>

<style scoped>
.lang-switcher-container {
  position: fixed;
  top: 20px;
  right: 80px;
  z-index: 999;
}

.lang-switcher {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 999px;
  background: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: var(--transition);
}

.lang-switcher:hover {
  box-shadow: var(--box-shadow);
  border-color: var(--primary-color);
}

.label {
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .lang-switcher-container {
    right: 72px;
  }
  .label { display: none; }
}
</style>


