import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
	build: {
		outDir: 'dist-iife',
		lib: {
			entry: 'src/iife.ts',
			name: 'EasyJsModal',
			formats: ['umd']
		},
		rollupOptions: {
			output: {
				entryFileNames: 'easy-js-modal.js',
				dir: resolve(__dirname, 'dist-iife')
			}
		}
	}
})
