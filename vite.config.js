import vue from '@vitejs/plugin-vue'
// import { defineConfig } from 'vite'
import requireTransform from 'vite-plugin-require-transform';

export default ({
  plugins: [
    vue(),
    requireTransform({
      fileRegex: /.js$|.vue$/
    }),
  ]
})
