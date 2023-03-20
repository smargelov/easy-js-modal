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
			output: {
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === 'style.css') return 'easy-js-modal.css'
					return assetInfo.name
				}
			}
		}
	}
})
