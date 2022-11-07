import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'localStorageEncryption',
      fileName: (format) => `local-storage-encryption.${format}.js`,
    },
  }
})
