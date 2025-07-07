<template>
  <div class="ico-info-section" v-if="icoInfo">
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template #title>
          <div class="info-header">
            <el-icon><InfoFilled /></el-icon>
            <span>ICO文件信息</span>
            <el-tag size="small" class="image-count-tag">
              {{ icoInfo.imageCount }}个图像
            </el-tag>
          </div>
        </template>

        <div class="ico-info-content">
          <div class="file-header">
            <el-icon><Document /></el-icon>
            <span>正在检查ICO文件信息</span>
          </div>

          <el-scrollbar height="420px" class="custom-scrollbar">
            <div class="images-list">
              <el-card
                  v-for="(img, index) in icoInfo.images"
                  :key="index"
                  class="image-info-card"
                  :class="{ 'has-warning': img.warning }"
              >
                <div class="image-info-header">
                  <span class="image-number">第{{ index + 1 }}张图像</span>
                  <el-tag size="small" :type="getTagType(img)" class="dimension-tag">
                    {{ img.width }}x{{ img.height }}
                  </el-tag>
                </div>

                <div class="image-details">
                  <div class="detail-item">
                    <span class="label">色深:</span>
                    <span class="value">{{ img.bpp }}bpp</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">大小:</span>
                    <span class="value">{{ formatBytes(img.size) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">偏移:</span>
                    <span class="value">{{ img.offset }}</span>
                  </div>
                </div>

                <div v-if="img.warning" class="warning-text">
                  <el-icon><Warning /></el-icon>
                  <span>{{ img.warning }}</span>
                </div>
              </el-card>
            </div>
          </el-scrollbar>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { InfoFilled, Document, Warning } from '@element-plus/icons-vue';

// 这里假设icoInfo会通过props传入
// 实际使用时替换为您的数据源
const props = defineProps({
  icoInfo: {
    type: Object,
    default: null
  }
});

const activeNames = ref(['1']);

// 根据尺寸确定标签类型
const getTagType = (img) => {
  if (img.width <= 32) return 'info';
  if (img.width <= 128) return 'success';
  if (img.width <= 512) return 'warning';
  return 'danger';
};

// 格式化字节数
const formatBytes = (bytes) => {
  if (bytes < 1024) return bytes + '字节';
  return (bytes / 1024).toFixed(2) + 'KB';
};
</script>

<style scoped>
.ico-info-section {
  margin: 30px 0;
  padding-top: 25px;
  border-top: 1px dashed var(--border-color, #e1e8ed);
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: var(--text-primary, #2c3e50);
  padding: 10px;
}

.info-header .el-icon {
  color: var(--primary-color, #4c84ff);
  font-size: 18px;
}

.image-count-tag {
  margin-left: 10px;
  background: linear-gradient(135deg, var(--primary-color, #4c84ff), var(--secondary-color, #45c6b0));
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  padding: 0 10px;
  height: 22px;
  line-height: 22px;
}

.ico-info-content {
  padding: 5px 10px 15px;
}

.file-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding: 12px 5px;
  font-size: 16px;
  color: var(--text-secondary, #5d6d7e);
  border-bottom: 1px solid var(--border-color, #e1e8ed);
  font-weight: 500;
}

.file-header :deep(.el-icon) {
  color: var(--primary-color, #4c84ff);
}

.custom-scrollbar {
  --el-scrollbar-bg-color: var(--primary-light, #e8f0ff);
  --el-scrollbar-hover-bg-color: var(--primary-color, #4c84ff);
}

.images-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 10px 5px;
}

.image-info-card {
  border-radius: 12px;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.image-info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 20px rgba(76, 132, 255, 0.15);
}

.has-warning {
  border-left: 3px solid var(--accent-color, #ff6b6b);
  background-color: rgba(255, 107, 107, 0.05);
}

.image-info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--border-color, #e1e8ed);
}

.image-number {
  font-weight: 600;
  color: var(--text-primary, #2c3e50);
  font-size: 15px;
}

.dimension-tag {
  border-radius: 8px;
  font-weight: 600;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
}

.image-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 15px;
  background-color: var(--background-grey, #f8fafc);
  padding: 12px;
  border-radius: 8px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.label {
  font-size: 12px;
  color: var(--text-light, #8395a7);
  font-weight: 600;
}

.value {
  font-size: 14px;
  color: var(--text-secondary, #5d6d7e);
  font-weight: 500;
}

.warning-text {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 15px;
  padding: 12px;
  border-radius: 8px;
  background-color: rgba(255, 107, 107, 0.1);
  color: var(--accent-color, #ff6b6b);
  font-size: 13px;
  font-weight: 500;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

:deep(.el-collapse-item__arrow) {
  margin-right: 8px;
  font-size: 16px;
}

@media (max-width: 768px) {
  .images-list {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .image-details {
    grid-template-columns: 1fr 1fr;
  }

  .file-header {
    font-size: 15px;
  }

  .ico-info-section {
    margin: 20px 0;
  }
  
  .info-header span {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .image-details {
    grid-template-columns: 1fr;
  }

  .detail-item {
    flex-direction: row;
    justify-content: space-between;
  }

  .label {
    font-size: 13px;
  }
}
</style>