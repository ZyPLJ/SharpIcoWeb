<template>
  <div class="sharp-ico-container">
    <ErrorBoundary @error="handleError">
      <el-card class="main-card">
        <!-- 标题区域 -->
        <div class="header">
          <h1>ICO 图标转换工具</h1>
          <p class="subtitle">快速将您的图片转换多尺寸ICO图标格式</p>
          <div class="feature-badges">
            <el-tag type="success" size="small">免费使用</el-tag>
            <el-tag type="info" size="small">无水印</el-tag>
            <el-tag type="warning" size="small">多尺寸</el-tag>
          </div>
        </div>

        <el-divider/>

        <!-- 主要内容区域 -->
        <div class="content">
          <!-- 上传和设置区域 -->
          <div class="upload-section">
            <!-- 文件上传区 -->
            <div class="upload-area">
              <el-upload
                  class="upload-dragger"
                  drag
                  :auto-upload="false"
                  :show-file-list="false"
                  :on-change="handleFileChange"
                  :accept="supportedFormats"
                  :before-upload="validateFile"
              >
                <el-icon class="upload-icon">
                  <Upload/>
                </el-icon>
                <div class="upload-text">
                  <span>拖拽图片到此处或点击上传</span>
                  <p class="upload-hint">
                    支持 {{ formatSupportedTypes() }} 格式，最大 {{ maxFileSize }}MB
                  </p>
                </div>
              </el-upload>
              
              <!-- 快速操作 -->
              <div class="quick-actions" v-if="!imageUrl">
                <p class="quick-title">快速开始：</p>
                <el-button-group>
                  <el-button size="small" @click="setPresetSizes('standard')">
                    标准尺寸
                  </el-button>
                  <el-button size="small" @click="setPresetSizes('web')">
                    网页图标
                  </el-button>
                  <el-button size="small" @click="setPresetSizes('app')">
                    应用图标
                  </el-button>
                </el-button-group>
              </div>
            </div>

            <!-- 转换设置 -->
            <div class="settings">
              <h3>转换设置</h3>
              <el-form label-position="top" :model="formData">
                <el-form-item label="ICO图标尺寸" required>
                  <el-select 
                    v-model="selectedSizes" 
                    multiple 
                    collapse-tags
                    collapse-tags-tooltip
                    placeholder="选择需要的尺寸"
                    style="width: 100%"
                  >
                    <el-option
                        v-for="size in availableSizes"
                        :key="size"
                        :label="`${size}×${size}px`"
                        :value="size"
                    >
                      <span style="float: left">{{ size }}×{{ size }}px</span>
                      <span style="float: right; color: var(--el-text-color-secondary)">
                        {{ getSizeDescription(size) }}
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
                
                <el-form-item>
                  <el-switch
                      v-model="isMultiSize"
                      class="mb-2"
                      active-text="分别生成"
                      inactive-text="合并生成"
                  />
                  <el-tooltip
                    content="合并生成：所有尺寸合并到一个ICO文件；分别生成：每个尺寸单独生成ICO文件并打包"
                    placement="top"
                  >
                    <el-icon class="info-icon"><QuestionFilled /></el-icon>
                  </el-tooltip>
                </el-form-item>
                
                <!-- 高级选项 -->
                <el-collapse v-model="activeCollapse" class="advanced-settings">
                  <el-collapse-item title="高级选项" name="advanced">
                    <el-form-item label="输出质量">
                      <el-slider
                        v-model="outputQuality"
                        :min="0"
                        :max="100"
                        show-stops
                        :marks="qualityMarks"
                      />
                    </el-form-item>
                  </el-collapse-item>
                </el-collapse>
              </el-form>
            </div>
          </div>

          <!-- 图片预览区域 -->
          <ImagePreview 
            v-if="imageUrl"
            :image-url="imageUrl"
            :selected-sizes="selectedSizes"
            :image-file="imageFile"
            @size-selected="onSizeSelected"
          />

          <!-- ICO 信息显示 -->
          <IcoInfoDisplay :ico-info="icoFileInfo" v-if="icoFileInfo"/>

          <!-- 操作按钮区域 -->
          <div class="action-section" v-if="imageUrl">
            <div class="action-buttons">
              <el-button 
                type="primary" 
                size="large"
                @click="convertToIco" 
                :disabled="!canConvert"
                :loading="isConverting"
              >
                <el-icon><Download/></el-icon>
                {{ isConverting ? '转换中...' : '转换并下载ICO' }}
              </el-button>
              <el-button size="large" @click="resetForm">
                <el-icon><RefreshRight/></el-icon>
                重置
              </el-button>
              <el-button :dark="isDark" color="#626aef" size="large" plain @click="showPreview = true">
                <el-icon><StarFilled /></el-icon>
                爱发电
              </el-button>
            </div>
            
            <!-- 转换统计 -->
            <div class="conversion-stats" v-if="conversionStats.total > 0">
              <el-statistic 
                title="已转换图片" 
                :value="conversionStats.total" 
                suffix="张"
              />
              <el-statistic 
                title="今日转换" 
                :value="conversionStats.today" 
                suffix="张"
              />
            </div>
          </div>
        </div>
      </el-card>

      <!-- 使用说明 -->
      <el-card class="help-card" v-if="!imageUrl">
        <template #header>
          <div class="help-header">
            <el-icon><QuestionFilled /></el-icon>
            <span>使用说明</span>
          </div>
        </template>
        
        <el-steps :active="0" align-center>
          <el-step 
            title="上传图片" 
            description="支持PNG、JPG、JPEG格式，最大10MB"
            icon="Upload"
          />
          <el-step 
            title="选择尺寸" 
            description="根据需要选择一个或多个ICO尺寸"
            icon="Setting"
          />
          <el-step 
            title="下载ICO" 
            description="一键转换并下载生成的ICO文件"
            icon="Download"
          />
        </el-steps>
      </el-card>

      <!-- 页脚 -->
      <footer class="footer">
        <div class="footer-content">
          <p>© {{ new Date().getFullYear() }} ICO图标转换工具 | 便捷、高效的在线图标转换服务</p>
          <div class="footer-links">
            <a href="../../ico.html" target="_blank" class="footer-link">关于我们</a>
            <span class="divider">|</span>
            <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank" rel="noopener noreferrer" class="footer-link">
              湘ICP备2024053728号
            </a>
          </div>
        </div>
      </footer>
      <el-image-viewer
          v-if="showPreview"
          ref="imageRef"
          :url-list="srcList"
          show-progress
          @close="showPreview = false"
      />
    </ErrorBoundary>

    <!-- GitHub 角标 -->
    <a href="https://github.com/ZyPLJ/SharpIcoWeb" target="_blank" aria-label="View source on Github"
       class="github-corner">
      <svg width="80" height="80" viewBox="0 0 250 250" aria-hidden="true" style="fill: #151513; color: #fff;">
        <path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
        <path
            d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2"
            fill="currentColor" class="octo-arm" style="transform-origin: 130px 106px;"></path>
        <path
            d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z"
            fill="currentColor" class="octo-body"></path>
      </svg>
    </a>
    <!-- 主题切换按钮 -->
    <ThemeToggle />

    <!-- 自定义加载组件 -->
    <LoadingSpinner 
      :show="isConverting"
      :text="loadingText"
      :progress="conversionProgress"
      :show-progress="showProgress"
    />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, reactive, watch } from 'vue';
import { Download, RefreshRight, Upload, QuestionFilled, StarFilled } from '@element-plus/icons-vue';
import { dowloadFile, getImageInfo, uploadFile, uploadFileZip } from '@/http/modules/fileUpload';
import { useDark } from '@vueuse/core'

// 导入新组件
import ErrorBoundary from './ErrorBoundary.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import ImagePreview from './ImagePreview.vue';
import IcoInfoDisplay from './IcoInfoDisplay.vue';
import ThemeToggle from "@/components/ThemeToggle.vue";

// 响应式数据
const imageUrl = ref('');
const imageFile = ref(null);
const availableSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];
const selectedSizes = ref([32, 48, 64]);
const isMultiSize = ref(false);
const outputQuality = ref(95);
const activeCollapse = ref([]);
const icoFileInfo = ref(null);
const isConverting = ref(false);
const loadingText = ref('');
const conversionProgress = ref(0);
const showProgress = ref(false);
const isDark = useDark();
const imageRef = ref();
const showPreview = ref(false);
const srcList = [
  '../../afdian-zy.jpg'
]

// 环境变量
const maxFileSize = ref(import.meta.env.VITE_MAX_FILE_SIZE || 10);
const supportedFormats = ref(import.meta.env.VITE_SUPPORTED_FORMATS?.split(',').map(f => `image/${f}`).join(',') || 'image/png,image/jpeg');

// 表单数据
const formData = reactive({
  sizes: selectedSizes,
  quality: outputQuality,
  multiSize: isMultiSize
});

// 转换统计
const conversionStats = reactive({
  total: parseInt(localStorage.getItem('conversion_total') || '0'),
  today: parseInt(localStorage.getItem(`conversion_today_${new Date().toDateString()}`) || '0')
});

// 质量标记
const qualityMarks = reactive({
  0: '最差',
  50: '良好', 
  100: '最佳'
});

// 计算属性
const canConvert = computed(() => {
  return imageUrl.value && selectedSizes.value.length > 0;
});

// 方法
const formatSupportedTypes = () => {
  return supportedFormats.value.split(',').map(type => type.split('/')[1].toUpperCase()).join('、');
};

const getSizeDescription = (size) => {
  const descriptions = {
    16: '浏览器标签',
    24: '小图标',
    32: '标准图标',
    48: '大图标',
    64: '高清小图标',
    128: '高清图标',
    256: '超高清',
    512: '极高清',
    1024: '视网膜显示'
  };
  return descriptions[size] || '自定义';
};

const setPresetSizes = (preset) => {
  const presets = {
    standard: [16, 32, 48],
    web: [16, 24, 32, 48],
    app: [32, 48, 64, 128, 256]
  };
  selectedSizes.value = presets[preset] || [];
  ElMessage.success(`已应用${preset === 'standard' ? '标准' : preset === 'web' ? '网页' : '应用'}尺寸预设`);
};

const validateFile = (file) => {
  const isValidType = supportedFormats.value.includes(file.type);
  const isValidSize = file.size / 1024 / 1024 < maxFileSize.value;
  
  if (!isValidType) {
    ElMessage.error(`请上传${formatSupportedTypes()}格式的图片文件!`);
    return false;
  }
  
  if (!isValidSize) {
    ElMessage.error(`图片大小不能超过 ${maxFileSize.value}MB!`);
    return false;
  }
  
  return true;
};

const handleFileChange = (file) => {
  if (!validateFile(file.raw)) return;
  
  imageFile.value = file.raw;
  imageUrl.value = URL.createObjectURL(file.raw);
  icoFileInfo.value = null;
  
  // 自动分析图片并推荐尺寸
  analyzeImageAndRecommendSizes(file.raw);
};

const analyzeImageAndRecommendSizes = (file) => {
  const img = new Image();
  img.onload = () => {
    const { width, height } = img;
    const minSize = Math.min(width, height);
    
    // 根据原图尺寸推荐合适的ICO尺寸
    const recommendedSizes = availableSizes.filter(size => size <= minSize);
    
    if (recommendedSizes.length > 0) {
      // 智能推荐
      const smartRecommendation = [];
      if (recommendedSizes.includes(16)) smartRecommendation.push(16);
      if (recommendedSizes.includes(32)) smartRecommendation.push(32);
      if (recommendedSizes.includes(48)) smartRecommendation.push(48);
      if (recommendedSizes.includes(256) && minSize >= 256) smartRecommendation.push(256);
      
      if (smartRecommendation.length > 0) {
        selectedSizes.value = smartRecommendation;
        ElMessage.success(`根据图片尺寸(${width}×${height})，已为您推荐合适的ICO尺寸`);
      }
    }
    
    URL.revokeObjectURL(img.src);
  };
  img.src = URL.createObjectURL(file);
};

const onSizeSelected = (size) => {
  ElMessage.info(`选中尺寸: ${size}×${size}`);
};

const convertToIco = async () => {
  if (!canConvert.value) {
    ElMessage.warning('请先上传图片并选择尺寸');
    return;
  }

  isConverting.value = true;
  showProgress.value = true;
  conversionProgress.value = 0;
  loadingText.value = '正在上传图片...';

  try {
    // 模拟进度更新
    const progressInterval = setInterval(() => {
      if (conversionProgress.value < 80) {
        conversionProgress.value += Math.random() * 20;
      }
    }, 500);

    const result = await (isMultiSize.value ? processMultiSize() : processSingleSize());
    
    clearInterval(progressInterval);
    conversionProgress.value = 100;
    loadingText.value = '转换完成，开始下载...';
    
    await new Promise(resolve => setTimeout(resolve, 500)); // 让用户看到完成状态
    
    handleDownload(result);
    updateConversionStats();
    ElMessage.success('转换成功！');
    
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || '转换失败';
    ElMessage.error(errorMessage);
    console.error('Conversion error:', err);
  } finally {
    isConverting.value = false;
    showProgress.value = false;
    conversionProgress.value = 0;
    loadingText.value = '';
  }
};

const processSingleSize = async () => {
  loadingText.value = '正在转换ICO文件...';
  const response = await uploadFile(imageFile.value, selectedSizes.value);

  if (response.statusCode !== 200) {
    throw new Error(response.message || '转换失败');
  }

  const path = response.data;
  await getIcoInfo(path);
  
  loadingText.value = '正在准备下载...';
  const res = await dowloadFile(path);

  if (!res.headers['content-type']?.includes('image/x-icon')) {
    throw new Error('无效的文件类型');
  }

  return {
    data: res.data,
    fileName: `icon_${Date.now()}.ico`,
    blobType: 'image/x-icon'
  };
};

const processMultiSize = async () => {
  loadingText.value = '正在生成多尺寸ICO文件...';
  icoFileInfo.value = null;

  const response = await uploadFileZip(imageFile.value, selectedSizes.value);

  if (!response.headers['content-type']?.includes('application/zip')) {
    const errorJson = await response.data.text().then(JSON.parse);
    throw new Error(errorJson?.message || '转换失败');
  }

  return {
    data: response.data,
    fileName: `icons_${Date.now()}.zip`,
    blobType: 'application/zip'
  };
};

// 获取ICO信息
const getIcoInfo = async (fileName) => {
  try {
    const res = await getImageInfo(fileName);
    if (res) {
      icoFileInfo.value = {
        imageCount: res.data.length,
        images: res.data
      };
    }
  } catch (error) {
    console.warn('Failed to get ICO info:', error);
  }
};

const handleDownload = ({ data, fileName, blobType }) => {
  const blob = new Blob([data], { type: blobType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const updateConversionStats = () => {
  conversionStats.total++;
  conversionStats.today++;
  
  localStorage.setItem('conversion_total', conversionStats.total.toString());
  localStorage.setItem(`conversion_today_${new Date().toDateString()}`, conversionStats.today.toString());
};

const resetForm = () => {
  imageUrl.value = '';
  imageFile.value = null;
  selectedSizes.value = [32, 48, 64];
  outputQuality.value = 95;
  icoFileInfo.value = null;
  isConverting.value = false;
  showProgress.value = false;
  
  ElMessage.success('已重置所有设置');
};

const handleError = (errorInfo) => {
  console.error('Component error:', errorInfo);
  ElMessage.error('组件出现错误，请刷新页面重试');
};

// 生命周期
onMounted(() => {
  // 初始化统计数据
  const today = new Date().toDateString();
  const lastStatsDate = localStorage.getItem('last_stats_date');
  
  if (lastStatsDate !== today) {
    localStorage.setItem(`conversion_today_${today}`, '0');
    localStorage.setItem('last_stats_date', today);
    conversionStats.today = 0;
  }
});

// 监听器
watch(selectedSizes, (newSizes) => {
  if (newSizes.length === 0) {
    ElMessage.warning('请至少选择一个ICO尺寸');
  }
}, { deep: true });
</script>

<style scoped>
.sharp-ico-container {
  max-width: var(--content-max-width);
  margin: var(--spacing-xl) auto;
  padding: 0 var(--spacing-lg);
  min-height: calc(100vh - var(--spacing-xxl));
}

.main-card {
  border-radius: var(--border-radius-lg);
  box-shadow: var(--box-shadow);
  margin-bottom: var(--spacing-xl);
  overflow: hidden;
  background-color: var(--background-card);
  border: 1px solid var(--border-light);
  transition: var(--transition);
}

.main-card:hover {
  box-shadow: var(--box-shadow-hover);
}

.header {
  text-align: center;
  padding: var(--spacing-xxl) var(--spacing-lg);
  background: linear-gradient(135deg, var(--primary-light), var(--background-light));
}

.header h1 {
  font-size: var(--font-size-xxl);
  margin-bottom: var(--spacing-md);
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-lg);
  font-weight: var(--font-weight-normal);
}

.feature-badges {
  display: flex;
  justify-content: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.content {
  padding: var(--spacing-xxl) var(--spacing-lg);
}

.upload-section {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--spacing-xxl);
  margin-bottom: var(--spacing-xxl);
}

.upload-area {
  position: relative;
}

.upload-dragger {
  transition: var(--transition);
}

.upload-dragger :deep(.el-upload) {
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius-lg);
  transition: var(--transition);
  padding: var(--spacing-xxl);
  background: var(--background-grey);
}

.upload-dragger :deep(.el-upload:hover) {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
  transform: translateY(-3px);
  box-shadow: var(--box-shadow);
}

.upload-icon {
  font-size: 54px;
  color: var(--primary-color);
  margin-bottom: var(--spacing-md);
  animation: bounce 2s infinite;
}

.upload-text {
  font-size: var(--font-size-md);
  color: var(--text-secondary);
  margin-top: var(--spacing-md);
}

.upload-hint {
  font-size: var(--font-size-sm);
  color: var(--text-light);
  margin-top: var(--spacing-sm);
}

.quick-actions {
  margin-top: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--background-card);
  border-radius: var(--border-radius);
  border: 1px solid var(--border-light);
}

.quick-title {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
}

.settings {
  background: var(--background-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--box-shadow-card);
  border: 1px solid var(--border-light);
  height: fit-content;
}

.settings h3 {
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.settings h3::before {
  content: "";
  width: 4px;
  height: 20px;
  background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
  border-radius: 2px;
}

.info-icon {
  margin-left: var(--spacing-sm);
  color: var(--text-light);
  cursor: help;
}

.advanced-settings {
  margin-top: var(--spacing-md);
}

:deep(.el-slider) {
  margin-top: 0;
  margin-left: 12px;
  margin-right: 12px;
}

.action-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  align-items: center;
  margin-top: var(--spacing-xxl);
  padding-top: var(--spacing-xl);
  border-top: 1px dashed var(--border-color);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.conversion-stats {
  display: flex;
  gap: var(--spacing-xxl);
}

.help-card {
  margin-bottom: var(--spacing-xl);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--border-light);
}

.help-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
}

.footer {
  text-align: center;
  margin-top: var(--spacing-xxl);
  color: var(--text-light);
  font-size: var(--font-size-sm);
  padding: var(--spacing-xl) 0;
  border-top: 1px solid var(--border-light);
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  align-items: center;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition-fast);
}

.footer-link:hover {
  color: var(--primary-color);
}

.divider {
  color: var(--border-color);
}


.github-corner {
  position: fixed;
  top: 0;
  left: 0;
  border: 0;
  transform: scaleX(-1); /* 翻转标志使其面向右侧 */
  z-index: 1000;
}

.github-corner svg {
  fill: var(--primary-color);
  color: white;
  transition: var(--transition);
}

.github-corner:hover svg {
  fill: var(--primary-dark);
}

.github-corner:hover .octo-arm {
  animation: octocat-wave 560ms ease-in-out;
}

@keyframes octocat-wave {
  0%, 100% { transform: rotate(0); }
  20%, 60% { transform: rotate(-25deg); }
  40%, 80% { transform: rotate(10deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sharp-ico-container {
    padding: 0 var(--spacing-md);
    margin: var(--spacing-lg) auto;
  }

  .content {
    padding: 0;
  }

  .header {
    padding: var(--spacing-lg);
  }

  .header h1 {
    font-size: var(--font-size-xl);
  }

  .upload-section {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }

  .settings {
    order: -1;
  }

  .upload-dragger :deep(.el-upload) {
    padding: var(--spacing-lg);
  }

  .action-buttons {
    flex-direction: column;
    width: 100%;
  }

  .action-buttons .el-button {
    width: 100%;
  }

  .conversion-stats {
    flex-direction: column;
    gap: var(--spacing-md);
    text-align: center;
  }

  .footer-content {
    padding: 0 var(--spacing-md);
  }

  .footer-links {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .divider {
    display: none;
  }
  
  :deep(.el-button-group) {
    display: flex;
  }

  .help-card {
    display: none;
  }

  .el-button+.el-button {
    margin-left:0;
  }
}
</style>