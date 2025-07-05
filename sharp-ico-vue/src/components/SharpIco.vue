<template>
  <div class="container">
    <el-card class="main-card">
      <div class="header">
        <h1>ICO 图标转换工具</h1>
        <p class="subtitle">快速将您的图片转换多尺寸ICO图标格式</p>
      </div>

      <el-divider/>

      <div class="content">
        <div class="upload-section">
          <el-upload
              class="upload-area"
              drag
              :auto-upload="false"
              :show-file-list="false"
              :on-change="handleFileChange"
              accept="image/png,image/jpeg"
          >
            <el-icon class="upload-icon">
              <Upload/>
            </el-icon>
            <div class="upload-text">
              <span>拖拽图片到此处或点击上传</span>
              <p class="upload-hint">支持PNG、JPG、jpeg格式</p>
            </div>
          </el-upload>

          <div class="settings">
            <h3>转换设置</h3>
            <el-form label-position="top">
              <el-form-item label="ICO图标尺寸">
                <el-select v-model="selectedSizes" multiple collapse-tags style="width: 100%">
                  <el-option
                      v-for="size in availableSizes"
                      :key="size"
                      :label="`${size}x${size}px`"
                      :value="size"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-switch
                    v-model="isMultiSize"
                    class="mb-2"
                    active-text="分别生成"
                    inactive-text="合并生成"
                />
              </el-form-item>
            </el-form>
          </div>
        </div>

        <div class="preview-section" v-if="imageUrl">
          <div class="preview-container">
            <h3>预览</h3>
            <div class="preview-images">
              <div class="original-preview">
                <h4>原始图片</h4>
                <div class="image-container">
                  <img :src="imageUrl" alt="原始图片"/>
                </div>
              </div>

              <el-divider direction="vertical"/>

              <div class="ico-preview">
                <h4>ICO预览</h4>
                <div class="ico-sizes">
                  <div v-for="size in previewSizes" :key="size" class="ico-size-preview">
                    <img :src="imageUrl" :style="`width: ${size}px; height: ${size}px`"/>
                    <span>{{ size }}x{{ size }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <IcoInfoDisplay :icoInfo="icoFileInfo"/>
          <div class="action-buttons">
            <el-button type="primary" @click="convertToIco" :disabled="!imageUrl">
              <el-icon>
                <Download/>
              </el-icon>
              转换并下载ICO
            </el-button>
            <el-button @click="resetForm">
              <el-icon>
                <RefreshRight/>
              </el-icon>
              重置
            </el-button>
          </div>
        </div>
      </div>
    </el-card>

    <footer class="footer">
      <p>© {{ new Date().getFullYear() }} ICO图标转换工具 | 便捷、高效的在线图标转换服务</p>
      <div class="footer-content">
        <p>
          <a href="../../ico.html" target="_blank" class="footer-link">关于我们</a>
          &nbsp;|&nbsp;
          <a href="https://beian.miit.gov.cn/#/Integrated/index" target="_blank" rel="noopener noreferrer"
             class="footer-link">
            湘ICP备2024053728号
          </a>
        </p>
      </div>
    </footer>
  </div>
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
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import {ElMessage} from 'element-plus';
import {Download, RefreshRight, Upload} from '@element-plus/icons-vue';
import {dowloadFile, getImageInfo, uploadFile, uploadFileZip} from '../http/modules/fileUpload'
import {ElLoading} from 'element-plus'
import IcoInfoDisplay from './IcoInfoDisplay.vue';

// 数据定义
const imageUrl = ref('');
const imageFile = ref(null);
const availableSizes = [16, 24, 32, 48, 64, 128, 256, 512, 1024];
const selectedSizes = ref([32, 48, 64]);
const backgroundColor = ref('rgba(255, 255, 255, 0)');
const isMultiSize = ref(false);

// ICO文件信息数据示例
const icoFileInfo = ref(null);

// 在转换后更新数据
const updateIcoInfo = async (fileName) => {
  const res = await getImageInfo(fileName)
  icoFileInfo.value = null
  if (res) {
    icoFileInfo.value = {
      imageCount: res.data.length,
      images: res.data
    };
  }
};

// 计算属性
const previewSizes = computed(() => {
  // 删除 512 1024 尺寸，因为它们太大了
  return selectedSizes.value.length > 0 ? selectedSizes.value.sort((a, b) => a - b).filter(size => size !== 512 && size !== 1024) : [32];
});

// 处理文件上传
const handleFileChange = (file) => {
  imageFile.value = file.raw;

  if (!file.raw) {
    return;
  }

  // 检查文件类型 PNG、JPG、jpeg
  const isImage = /image\/(png|jpe?g)/.test(file.raw.type);
  if (!isImage) {
    ElMessage.error('请上传PNG、JPG、jpeg格式的图片文件!');
    return;
  }

  if (file.raw.size / 1024 / 1024 > 10) {
    ElMessage.error('图片大小不能超过 10MB!');
    return false
  }

  // 创建URL预览
  imageUrl.value = URL.createObjectURL(file.raw);
};

// 转换为ICO并下载
const convertToIco = async () => {
  if (!imageFile.value) {
    ElMessage.warning('请先上传图片');
    return
  }

  const loading = ElLoading.service({
    lock: true,
    text: 'Loading',
    background: 'rgba(0, 0, 0, 0.7)',
  })

  try {
    const result = await (isMultiSize.value ? processMultiSize() : processSingleSize());
    handleDownload(result);
    ElMessage.success('转换成功！');
  } catch (err) {
    const errorMessage = err.response?.data?.message || err.message || '转换失败'
    ElMessage.error(errorMessage);
  } finally {
    loading.close()
  }
}

// 获取尺寸合并的ICO
const processSingleSize = async () => {
  const response = await uploadFile(imageFile.value, selectedSizes.value);

  if (response.statusCode !== 200) {
    throw new Error(response.message || '转换失败');
  }

  const path = response.data;
  await updateIcoInfo(path);
  const res = await dowloadFile(path);

  if (!res.headers['content-type']?.includes('image/x-icon')) {
    throw new Error('无效的文件类型');
  }

  return {
    data: res.data,
    fileName: `icon_${Date.now()}.ico`,
    blobType: 'image/x-icon'
  }
}

// 获取多个单尺寸的ICO压缩包
const processMultiSize = async () => {
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
  }
}

// 下载文件
const handleDownload = ({data, fileName, blobType}) => {
  const blob = new Blob([data], {type: blobType});
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// 重置表单
const resetForm = () => {
  imageUrl.value = '';
  imageFile.value = null;
  selectedSizes.value = [32, 48, 64];
  backgroundColor.value = 'rgba(255, 255, 255, 0)';
  icoFileInfo.value = null;
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  width: 100%; /* 添加这行 */
  box-sizing: border-box; /* 添加这行 */
}

.main-card {
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 40px;
  overflow: hidden;
  background-color: var(--background-light);
  border: none;
}

.header {
  text-align: center;
  padding: 30px 0;
}

.header h1 {
  font-size: 38px;
  margin-bottom: 12px;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(135deg, #3a8ee6, #53a8ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
  font-weight: 400;
  color: #606266;
}

.content {
  padding: 40px;
}

.upload-section {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin-bottom: 40px;
}

.upload-area {
  flex: 1;
  min-width: 300px;
  transition: var(--transition);
}

.el-upload {
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius);
  transition: var(--transition);
  overflow: hidden;
}

.el-upload:hover {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
  transform: translateY(-3px);
}

.upload-icon {
  font-size: 54px;
  color: var(--primary-color);
  margin-bottom: 15px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.upload-text {
  font-size: 14px;
  margin-top: 15px;
  color: var(--text-secondary);
}

.upload-hint {
  font-size: 14px;
  color: var(--text-light);
  margin-top: 8px;
}

.settings {
  width: 320px;
  background-color: var(--background-grey);
  border-radius: var(--border-radius);
  padding: 25px;
  box-shadow: 0 3px 15px rgba(0,0,0,0.05);
}

.settings h3 {
  margin-bottom: 20px;
  color: var(--text-primary);
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
}

.settings h3:after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50px;
  height: 3px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  border-radius: 3px;
}

.el-divider {
  margin: 10px 0 30px;
  background-color: rgba(76, 132, 255, 0.15);
}

.preview-section {
  margin-top: 30px;
  border-top: 1px dashed var(--border-color);
  padding-top: 30px;
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.preview-container {
  margin-bottom: 40px;
}

.preview-container h3 {
  margin-bottom: 25px;
  color: var(--text-primary);
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.preview-container h3:after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
  border-radius: 3px;
}

.preview-images {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.original-preview, .ico-preview {
  flex: 1;
  background-color: var(--background-light);
  border-radius: var(--border-radius);
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.05);
}

.original-preview h4, .ico-preview h4 {
  margin-bottom: 20px;
  color: var(--text-secondary);
  font-weight: 600;
  display: flex;
  align-items: center;
}

.original-preview h4:before, .ico-preview h4:before {
  content: "•";
  color: var(--primary-color);
  font-size: 24px;
  margin-right: 8px;
  line-height: 0;
}

.image-container {
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  overflow: hidden;
  background-color: var(--background-grey);
  transition: var(--transition);
}

.image-container:hover {
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: var(--transition);
}

.ico-sizes {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: center;
}

.ico-size-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 10px;
  background-color: var(--background-grey);
  transition: var(--transition);
}

.ico-size-preview:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

.ico-size-preview span {
  margin-top: 10px;
  font-size: 13px;
  color: var(--text-secondary);
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 600;
  transition: var(--transition);
  padding: 12px 24px;
  height: auto;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  border: none;
}

:deep(.el-button--primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(76, 132, 255, 0.3);
}

:deep(.el-button:not(.el-button--primary)) {
  border-color: var(--border-color);
}

:deep(.el-button:not(.el-button--primary):hover) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.ico-info-section {
  margin: 20px 0 30px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--text-primary);
}

.info-header .el-icon {
  color: var(--primary-color);
}

.image-count-tag {
  margin-left: 10px;
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
}

.footer {
  text-align: center;
  margin-top: 50px;
  color: var(--text-light);
  font-size: 14px;
  padding: 20px 0;
}

.footer p {
  margin: 5px 0;
}

.footer-link {
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition);
}

.footer-link:hover {
  color: var(--primary-color);
}

.github-corner {
  position: absolute;
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

@media (max-width: 500px) {
  .github-corner:hover .octo-arm {
    animation: none;
  }

  .github-corner .octo-arm {
    animation: octocat-wave 560ms ease-in-out;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 10px;
    margin: 20px auto;
  }

  .content {
    padding: 20px 15px;
  }

  .header {
    padding: 25px 10px;
  }

  .header h1 {
    font-size: 28px;
  }

  .upload-section {
    gap: 25px;
  }

  .upload-area, .settings {
    width: 100%;
    min-width: auto;
  }

  .settings {
    padding: 20px;
  }

  .preview-images {
    flex-direction: column;
    gap: 25px;
  }

  .action-buttons {
    flex-direction: column;
  }

  .el-button {
    width: 100%;
  }

  .el-button+.el-button {
    margin-left:0;
  }
    
  .image-container {
    height: 200px; /* 缩小高度 */
  }

  .preview-images {
    gap: 15px; /* 减小间距 */
  }

  .original-preview, .ico-preview {
    padding: 5px; /* 减小内边距 */
  }

  .image-container img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain; /* 确保图片完整显示 */
  }

  .ico-size-preview {
    flex: 1 0 calc(50% - 15px); /* 两列显示 */
    max-width: 128px;
    padding: 10px;
    overflow:hidden;
  }
}
</style>