import { test, expect } from 'vitest'
import { EasyJsModal } from './EasyJsModal'

test('Modal opens and closes', async () => {
	const content = '<p>Hello, world!</p>'
	const modal = new EasyJsModal(content)

	modal.open()
	const modalElement = document.querySelector('.modal') as HTMLElement
	expect(modalElement).toBeDefined()
	expect(modalElement.style.display).toBe('flex')

	modal.close()
	setTimeout(() => {
		expect(modalElement.style.display).toBe('')
	}, 400)
})

test('Modal adds and removes event listeners', async () => {
	const content = '<p>Hello, world!</p>'
	const modal = new EasyJsModal(content)

	const clickEvent = document.createEvent('MouseEvent')
	clickEvent.initMouseEvent(
		'click',
		true,
		true,
		// @ts-expect-error: initMouseEvent() expects a Window object, but vitest provides a Document object
		null,
		0,
		0,
		0,
		0,
		0,
		false,
		false,
		false,
		false,
		0,
		null
	)

	const keyDownEvent = document.createEvent('KeyboardEvent')
	keyDownEvent.initKeyboardEvent(
		'keydown',
		true,
		true,
		null,
		'Escape',
		0,
		false,
		false,
		false
	)

	modal.open()

	const closeButton = document.querySelector('.modal__close') as HTMLElement
	const modalElement = document.querySelector('.modal') as HTMLElement
	expect(closeButton).toBeDefined()
	closeButton.dispatchEvent(clickEvent)
	setTimeout(() => {
		expect(modalElement.style.display).toBe('')
	}, 400)

	modal.open()
	document.dispatchEvent(keyDownEvent)
	setTimeout(() => {
		expect(modalElement.style.display).toBe('')
	}, 400)
})
