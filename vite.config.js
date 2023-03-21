import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		lib: {
			entry: 'src/main.ts',
			name: 'EasyJsModal',
			fileName: 'easy-js-modal'
		},
		rollupOptions: {
			external: [],
			output: {}
		}
	}
})
