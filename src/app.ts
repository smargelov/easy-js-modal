import './easy-js-modal.sass'
import EasyJsModal from './EasyJsModal'

const ready = () => {
	document
		.querySelector<HTMLElement>('#openForm')!
		.addEventListener('click', () => {
			const modal = new EasyJsModal(
				'<h1>Modal</h1><p>Modal <a href="#">content</a></p>',
				{
					animationDuration: 500,
					onOpen
				},
				{
					windowBackgroundColor: '#ccc'
				}
			)
			modal.open()
		})
}

function onOpen(): void {
	console.log('Modal opened')
}

document.addEventListener('DOMContentLoaded', ready)
