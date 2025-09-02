import { createI18n } from 'vue-i18n'

const messages = {
  zh: {
    app: {
      name: 'Sharp ICO',
      loading: '正在加载应用...'
    },
    common: {
      confirm: '确定',
      cancel: '取消',
      update: '更新',
      reset: '重置',
      success: '成功',
      fail: '失败',
      custom: '自定义'
    },
    header: {
      title: 'ICO 图标转换工具',
      subtitle: '快速将您的图片转换多尺寸ICO图标格式',
      free: '免费使用',
      noWatermark: '无水印',
      multiSize: '多尺寸'
    },
    upload: {
      dragOrClick: '拖拽图片到此处或点击上传',
      hint: '支持 {types} 格式，最大 {size}MB',
      quickStart: '快速开始：',
      preset: {
        standard: '标准尺寸',
        web: '网页图标',
        app: '应用图标'
      }
    },
    settings: {
      title: '转换设置',
      icoSize: 'ICO图标尺寸',
      placeholder: '选择需要的尺寸',
      multiGenerateActive: '分别生成',
      multiGenerateInactive: '合并生成',
      mergeTip: '合并生成：所有尺寸合并到一个ICO文件；分别生成：每个尺寸单独生成ICO文件并打包',
      advanced: '高级选项',
      quality: '输出质量',
      qualityMarks: { worst: '最差', good: '良好', best: '最佳' }
    },
    actions: {
      convertAndDownload: '转换并下载ICO',
      converting: '转换中...',
      resetAll: '已重置所有设置'
    },
    stats: {
      converted: '已转换图片',
      today: '今日转换',
      unit: '张'
    },
    help: {
      title: '使用说明',
      step1Title: '上传图片',
      step1Desc: '支持PNG、JPG、JPEG格式，最大10MB',
      step2Title: '选择尺寸',
      step2Desc: '根据需要选择一个或多个ICO尺寸',
      step3Title: '下载ICO',
      step3Desc: '一键转换并下载生成的ICO文件'
    },
    footer: {
      about: '关于我们',
      copyright: '© {year} ICO图标转换工具 - 便捷、高效的在线图标转换服务',
      sponsor: '❤ 爱发电 - 赞助作者「ICO图标转换」',
      authorSite: '作者网站：'
    },
    dev: {
      shortcuts: '快捷键',
      focusUpload: '聚焦上传区域',
      toggleTheme: '切换主题'
    },
    notify: {
      announce: '公告',
      welcomeMessageHtml: '<p>欢迎使用 sharpIcoWeb ！当前版本 {version}</p>\n        <p><a href="https://afdian.com/a/pljzy" target="_blank">赞助：爱发电</a></p>'
    },
    preview: {
      title: '预览',
      original: '原始图片',
      icoTitle: 'ICO预览 ({count} 个尺寸)',
      sizeAlt: '{size}×{size} 预览',
      hd: '高清',
      tipsTitle: '提示',
      tips1: '推荐包含 32×32、48×48 用于系统图标',
      tips2: '16×16 适用于浏览器标签页',
      tips3: '256×256 及以上提供高清显示',
      loadFail: '图片加载失败'
    },
    icoInfo: {
      title: 'ICO文件信息',
      checking: '正在检查ICO文件信息',
      imageCount: '{count}个图像',
      imageNumber: '第{num}张图像',
      depth: '色深:',
      size: '大小:',
      offset: '偏移:'
    },
    sizeDesc: {
      16: '浏览器标签',
      24: '小图标',
      32: '标准图标',
      48: '大图标',
      64: '高清小图标',
      128: '高清图标',
      256: '超高清',
      512: '极高清',
      1024: '视网膜显示'
    },
    messages: {
      recommend: '根据图片尺寸({width}×{height})，已为您推荐合适的ICO尺寸',
      selectAtLeastOne: '请至少选择一个ICO尺寸',
      pleaseUploadAndChoose: '请先上传图片并选择尺寸',
      uploading: '正在上传图片...',
      converting: '正在转换ICO文件...',
      preparing: '正在准备下载...',
      convertSuccess: '转换成功！',
      invalidType: '无效的文件类型',
      uploadTypeError: '请上传{types}格式的图片文件!',
      sizeTooLarge: '图片大小不能超过 {size}MB!',
      newVersion: '检测到新版本，点击按钮更新页面？',
      tip: '提示',
      later: '稍后'
    },
    lang: {
      zh: '中文',
      en: 'English',
      ja: '日本語'
    }
  },
  en: {
    app: { name: 'Sharp ICO', loading: 'Loading application...' },
    common: { confirm: 'OK', cancel: 'Cancel', update: 'Update', reset: 'Reset', success: 'Success', fail: 'Fail', custom: 'Custom' },
    header: { title: 'ICO Icon Converter', subtitle: 'Quickly convert your images into multi-size ICO icons', free: 'Free', noWatermark: 'No watermark', multiSize: 'Multi-size' },
    upload: { dragOrClick: 'Drag image here or click to upload', hint: 'Supports {types} formats, max {size}MB', quickStart: 'Quick start:', preset: { standard: 'Standard', web: 'Web Icon', app: 'App Icon' } },
    settings: { title: 'Conversion Settings', icoSize: 'ICO Sizes', placeholder: 'Select sizes', multiGenerateActive: 'Generate separately', multiGenerateInactive: 'Merge into one', mergeTip: 'Merge: all sizes into one ICO; Separate: each size into a ZIP', advanced: 'Advanced', quality: 'Output Quality', qualityMarks: { worst: 'Worst', good: 'Good', best: 'Best' } },
    actions: { convertAndDownload: 'Convert and Download ICO', converting: 'Converting...', resetAll: 'All settings reset' },
    stats: { converted: 'Converted', today: 'Today', unit: '' },
    help: { title: 'How to Use', step1Title: 'Upload', step1Desc: 'Supports PNG, JPG, JPEG, up to 10MB', step2Title: 'Choose sizes', step2Desc: 'Pick one or more ICO sizes', step3Title: 'Download', step3Desc: 'Convert and download with one click' },
    footer: { about: 'About', copyright: '© {year} ICO Icon Converter - Fast and easy online icon conversion', sponsor: '❤ Afdian - Sponsor the author', authorSite: 'Author site: ' },
    dev: { shortcuts: 'Shortcuts', focusUpload: 'Focus upload area', toggleTheme: 'Toggle theme' },
    notify: {
      announce: 'Announcement',
      welcomeMessageHtml: '<p>Welcome to sharpIcoWeb! Current version {version}</p>\n        <p><a href="https://afdian.com/a/pljzy" target="_blank">Sponsor on Afdian</a></p>'
    },
    preview: {
      title: 'Preview',
      original: 'Original Image',
      icoTitle: 'ICO Preview ({count} sizes)',
      sizeAlt: '{size}×{size} preview',
      hd: 'HD',
      tipsTitle: 'Tips',
      tips1: 'Include 32×32, 48×48 for system icons',
      tips2: '16×16 is suitable for browser tabs',
      tips3: '256×256 and above provide high definition',
      loadFail: 'Image failed to load'
    },
    icoInfo: {
      title: 'ICO File Info',
      checking: 'Checking ICO file information',
      imageCount: '{count} images',
      imageNumber: 'Image #{num}',
      depth: 'Color depth:',
      size: 'Size:',
      offset: 'Offset:'
    },
    sizeDesc: { 16: 'Browser tab', 24: 'Small icon', 32: 'Standard', 48: 'Large icon', 64: 'HD small', 128: 'HD icon', 256: 'Ultra HD', 512: 'Extreme HD', 1024: 'Retina' },
    messages: { recommend: 'Based on image size ({width}×{height}), recommended ICO sizes applied', selectAtLeastOne: 'Select at least one ICO size', pleaseUploadAndChoose: 'Please upload an image and select sizes', uploading: 'Uploading image...', converting: 'Converting ICO...', preparing: 'Preparing download...', convertSuccess: 'Converted successfully!', invalidType: 'Invalid file type', uploadTypeError: 'Please upload image files of {types} types!', sizeTooLarge: 'Image size must be less than {size}MB!', newVersion: 'New version detected. Reload now?', tip: 'Notice', later: 'Later' },
    lang: { zh: '中文', en: 'English', ja: '日本語' }
  },
  ja: {
    app: { name: 'Sharp ICO', loading: 'アプリを読み込み中...' },
    common: { confirm: '確認', cancel: 'キャンセル', update: '更新', reset: 'リセット', success: '成功', fail: '失敗', custom: 'カスタム' },
    header: { title: 'ICO アイコン変換ツール', subtitle: '画像をマルチサイズICOアイコンに迅速変換', free: '無料', noWatermark: '透かしなし', multiSize: 'マルチサイズ' },
    upload: { dragOrClick: 'ここにドラッグするかクリックしてアップロード', hint: '{types} 形式対応、最大 {size}MB', quickStart: 'クイックスタート：', preset: { standard: '標準サイズ', web: 'Web アイコン', app: 'アプリ アイコン' } },
    settings: { title: '変換設定', icoSize: 'ICO サイズ', placeholder: 'サイズを選択', multiGenerateActive: '個別生成', multiGenerateInactive: '結合生成', mergeTip: '結合生成：すべてのサイズを1つのICOに；個別生成：各サイズを個別にZIP化', advanced: '高度な設定', quality: '出力品質', qualityMarks: { worst: '最低', good: '良好', best: '最高' } },
    actions: { convertAndDownload: '変換してICOをダウンロード', converting: '変換中...', resetAll: 'すべての設定をリセットしました' },
    stats: { converted: '変換済み', today: '本日', unit: '枚' },
    help: { title: '使い方', step1Title: '画像をアップロード', step1Desc: 'PNG・JPG・JPEG対応、最大10MB', step2Title: 'サイズを選択', step2Desc: '必要なICOサイズを1つ以上選択', step3Title: 'ICOをダウンロード', step3Desc: 'ワンクリックで変換しダウンロード' },
    footer: { about: '私たちについて', copyright: '© {year} ICOアイコン変換ツール - 便利で高効率なオンライン変換サービス', sponsor: '❤ Afdian - 作者を支援', authorSite: '作者サイト：' },
    dev: { shortcuts: 'ショートカット', focusUpload: 'アップロードにフォーカス', toggleTheme: 'テーマ切替' },
    notify: {
      announce: 'お知らせ',
      welcomeMessageHtml: '<p>sharpIcoWeb へようこそ！現在のバージョン {version}</p>\n        <p><a href="https://afdian.com/a/pljzy" target="_blank">Afdian で支援</a></p>'
    },
    preview: {
      title: 'プレビュー',
      original: '元の画像',
      icoTitle: 'ICOプレビュー（{count} サイズ）',
      sizeAlt: '{size}×{size} プレビュー',
      hd: 'HD',
      tipsTitle: 'ヒント',
      tips1: 'システムアイコンには 32×32、48×48 を含める',
      tips2: '16×16 はブラウザタブに適しています',
      tips3: '256×256 以上は高解像度表示',
      loadFail: '画像の読み込みに失敗しました'
    },
    icoInfo: {
      title: 'ICOファイル情報',
      checking: 'ICOファイル情報を確認中',
      imageCount: '{count} 枚の画像',
      imageNumber: '画像 {num}',
      depth: '色深度:',
      size: 'サイズ:',
      offset: 'オフセット:'
    },
    sizeDesc: { 16: 'ブラウザタブ', 24: '小アイコン', 32: '標準', 48: '大アイコン', 64: 'HD小', 128: 'HDアイコン', 256: '超高精細', 512: '極高精細', 1024: 'Retina' },
    messages: { recommend: '画像サイズ({width}×{height})に基づき、適切なICOサイズを推奨しました', selectAtLeastOne: '少なくとも1つのICOサイズを選択してください', pleaseUploadAndChoose: 'まず画像をアップロードしてサイズを選択してください', uploading: '画像をアップロード中...', converting: 'ICOを変換中...', preparing: 'ダウンロードを準備中...', convertSuccess: '変換が成功しました！', invalidType: '無効なファイルタイプ', uploadTypeError: '{types} 形式の画像ファイルをアップロードしてください!', sizeTooLarge: '画像サイズは {size}MB を超えてはいけません!', newVersion: '新しいバージョンが検出されました。今すぐ再読み込みしますか？', tip: 'ヒント', later: '後で' },
    lang: { zh: '中文', en: 'English', ja: '日本語' }
  }
}

const getStartingLocale = () => {
  const saved = localStorage.getItem('locale')
  if (saved) return saved
  const browser = navigator.language?.toLowerCase() || 'zh'
  if (browser.startsWith('zh')) return 'zh'
  if (browser.startsWith('ja')) return 'ja'
  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getStartingLocale(),
  fallbackLocale: 'en',
  messages
})

export default i18n


