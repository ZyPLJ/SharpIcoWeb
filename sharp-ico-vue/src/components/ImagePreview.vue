<template>
  <div class="image-preview" v-if="imageUrl">
    <transition name="fade">
      <div class="preview-container">
        <div class="preview-header">
          <h3>{{ t('preview.title') }}</h3>
          <div class="preview-actions">
            <el-button 
              size="small" 
              @click="downloadOriginal"
              icon="Download"
              circle
            />
          </div>
        </div>
        
        <div class="preview-content">
          <div class="original-preview">
            <h4>
              <el-icon><PictureRounded /></el-icon>
              {{ t('preview.original') }}
            </h4>
            <div class="image-container" :class="{ 'zoomed': isZoomed }">
              <img 
                :src="imageUrl" 
                :alt="t('preview.original')"
                @load="onImageLoad"
                @error="onImageError"
                :style="imageStyle"
              />
              <div class="image-info" v-if="imageInfo">
                <span>{{ imageInfo.width }} × {{ imageInfo.height }}</span>
                <span>{{ formatFileSize(imageInfo.size) }}</span>
              </div>
            </div>
          </div>

          <el-divider direction="vertical" class="hidden-xs" />

          <div class="ico-preview">
            <h4>
              <el-icon><Grid /></el-icon>
              {{ t('preview.icoTitle', { count: previewSizes.length }) }}
            </h4>
            <div class="ico-sizes">
              <div 
                v-for="size in previewSizes" 
                :key="size" 
                class="ico-size-preview"
                @click="selectSize(size)"
                :class="{ 'selected': selectedSize === size }"
              >
                <img 
                  :src="imageUrl" 
                  :style="`width: ${Math.min(size, 64)}px; height: ${Math.min(size, 64)}px`"
                  :alt="t('preview.sizeAlt', { size })"
                />
                <span>{{ size }}×{{ size }}</span>
                <div class="size-indicator" v-if="size >= 256">
                  <el-tag size="small" type="warning">{{ t('preview.hd') }}</el-tag>
                </div>
              </div>
            </div>
            
            <div class="ico-tips">
              <el-alert
                :title="t('preview.tipsTitle')"
                type="info"
                :closable="false"
                show-icon
              >
                <template #default>
                  <ul>
                    <li>{{ t('preview.tips1') }}</li>
                    <li>{{ t('preview.tips2') }}</li>
                    <li>{{ t('preview.tips3') }}</li>
                  </ul>
                </template>
              </el-alert>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { PictureRounded, Grid, ZoomIn, ZoomOut, Download } from '@element-plus/icons-vue'

const props = defineProps({
  imageUrl: String,
  selectedSizes: {
    type: Array,
    default: () => []
  },
  imageFile: Object
})

const emit = defineEmits(['size-selected'])

const isZoomed = ref(false)
const selectedSize = ref(null)
const imageInfo = ref(null)
const { t } = useI18n()

const previewSizes = computed(() => {
  // 过滤掉过大的尺寸以便预览
  return props.selectedSizes.filter(size => size <= 512).sort((a, b) => a - b)
})

const imageStyle = computed(() => {
  if (isZoomed.value) {
    return {
      maxWidth: 'none',
      maxHeight: 'none',
      width: 'auto',
      height: 'auto',
      cursor: 'zoom-out'
    }
  }
  return {
    cursor: 'zoom-in'
  }
})

const onImageLoad = (event) => {
  const img = event.target
  imageInfo.value = {
    width: img.naturalWidth,
    height: img.naturalHeight,
    size: props.imageFile?.size || 0
  }
}

const onImageError = () => {
  ElMessage.error(t('preview.loadFail'))
}

const toggleZoom = () => {
  isZoomed.value = !isZoomed.value
}

const selectSize = (size) => {
  selectedSize.value = size
  emit('size-selected', size)
}

const downloadOriginal = () => {
  if (props.imageUrl) {
    const link = document.createElement('a')
    link.href = props.imageUrl
    link.download = `original-${Date.now()}.${getFileExtension()}`
    link.click()
  }
}

const getFileExtension = () => {
  if (props.imageFile?.type) {
    return props.imageFile.type.split('/')[1] || 'png'
  }
  return 'png'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

watch(() => props.selectedSizes, () => {
  selectedSize.value = null
})
</script>

<style scoped>
.image-preview {
  margin-top: var(--spacing-xl);
  border-top: 1px dashed var(--border-color);
  padding-top: var(--spacing-xl);
}

.preview-container {
  animation: fadeIn 0.5s ease-out;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.preview-header h3 {
  color: var(--text-primary);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.preview-header h3::before {
  content: "";
  width: 4px;
  height: 20px;
  background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
  border-radius: 2px;
}

.preview-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.preview-content {
  display: flex;
  gap: var(--spacing-xl);
  align-items: flex-start;
}

.original-preview, .ico-preview {
  flex: 1;
  background: var(--background-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--box-shadow-card);
  border: 1px solid var(--border-light);
  transition: var(--transition);
}

.original-preview:hover, .ico-preview:hover {
  box-shadow: var(--box-shadow-hover);
  transform: translateY(-2px);
}

.original-preview h4, .ico-preview h4 {
  margin-bottom: var(--spacing-md);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.image-container {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 250px;
  overflow: hidden;
  background: var(--background-grey);
  position: relative;
  transition: var(--transition);
}

.image-container.zoomed {
  overflow: auto;
  max-height: 400px;
  max-width: 60%;
}

.image-container img {
  max-width: 100%;
  max-height: 220px;
  object-fit: contain;
  transition: var(--transition);
  border-radius: var(--border-radius-sm);
}

.image-info {
  position: absolute;
  bottom: var(--spacing-sm);
  right: var(--spacing-sm);
  background: var(--background-overlay);
  backdrop-filter: var(--blur-background);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  color: var(--text-light);
  display: flex;
  gap: var(--spacing-sm);
}

.ico-sizes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.ico-size-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-sm);
  background: var(--background-light);
  transition: var(--transition);
  cursor: pointer;
  position: relative;
}

.ico-size-preview:hover {
  border-color: var(--primary-color);
  transform: translateY(-3px);
  box-shadow: var(--box-shadow);
}

.ico-size-preview.selected {
  border-color: var(--primary-color);
  background: var(--primary-light);
}

.ico-size-preview img {
  border-radius: var(--border-radius-sm);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ico-size-preview span {
  margin-top: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

.size-indicator {
  position: absolute;
  top: -8px;
  right: -8px;
}

.ico-tips {
  margin-top: var(--spacing-md);
}

.ico-tips ul {
  margin: 0;
  padding-left: var(--spacing-md);
  list-style: none;
}

.ico-tips li {
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
  color: var(--text-light);
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

.fade-enter-active, .fade-leave-active {
  transition: var(--transition);
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 768px) {
  .preview-content {
    flex-direction: column;
    gap: var(--spacing-lg);
  }
  
  .preview-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }
  
  .ico-sizes {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
    gap: var(--spacing-sm);
  }
  
  .image-container {
    min-height: 200px;
  }
  
  .image-container img {
    max-height: 180px;
  }

  .ico-tips div {
    display: block;
  }
}
</style>