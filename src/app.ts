import './easy-js-modal.sass'
import EasyJsModal from './EasyJsModal'

const ready = () => {
	document
		.querySelector<HTMLElement>('#openForm')!
		.addEventListener('click', () => {
			const modal = new EasyJsModal(
				'<h1>Modal</h1><p>Modal <a class="modal-test" href="#">content</a></p>',
				{
					animationDuration: 500,
					/* eslint-disable no-use-before-define */
					onOpen
				},
				{
					windowBackgroundColor: '#ccc'
				}
			)
			modal.open()
			function onOpen(): void {
				document
					.querySelector<HTMLElement>('.modal-test')!
					.addEventListener('click', (event) => {
						event.preventDefault()
						modal.setContent('<h1>Updated content</h1>')
					})
			}
		})
}

document.addEventListener('DOMContentLoaded', ready)
