import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [
      vue(),
      
      // 自动导入 Vue 和 Element Plus
      AutoImport({
        resolvers: [ElementPlusResolver()],
        imports: [
          'vue',
          '@vueuse/core',
          {
            'element-plus': [
              'ElMessage',
              'ElMessageBox',
              'ElNotification',
              'ElLoading'
            ]
          }
        ],
        dts: true,
        eslintrc: {
          enabled: true
        }
      }),
      
      // 自动导入组件
      Components({
        resolvers: [ElementPlusResolver()],
        dts: true
      }),
      
      // Gzip 压缩
      viteCompression({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
      
      // 构建分析
      mode === 'analyze' && visualizer({
        filename: 'dist/report.html',
        open: true,
        gzipSize: true,
        brotliSize: true,
      })
    ].filter(Boolean),
    
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '~': resolve(__dirname, 'src'),
      }
    },
    
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:5235',
          changeOrigin: true,
          rewrite: (path) => path
        },
      },
    },
    
    build: {
      target: 'es2015',
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'esbuild',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          manualChunks: {
            'element-plus': ['element-plus'],
            'vue-vendor': ['vue', '@vue/runtime-dom'],
            'utils': ['axios', '@vueuse/core']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/variables.scss" as *;`
        }
      }
    },
    
    optimizeDeps: {
      include: [
        'vue',
        'element-plus',
        '@element-plus/icons-vue',
        'axios',
        '@vueuse/core'
      ]
    }
  }
})
