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

test('Only one active modal instance', async () => {
	const content1 = '<p>Content 1</p>'
	const content2 = '<p>Content 2</p>'

	const modal1 = new EasyJsModal(content1)
	const modal2 = new EasyJsModal(content2)

	modal1.open()
	const modal1Element = document.querySelector('.modal') as HTMLElement
	expect(modal1Element).toBeDefined()
	expect(modal1Element.style.display).toBe('flex')

	const originalWarn = console.warn
	let warningCalled = false
	console.warn = () => {
		warningCalled = true
	}

	modal2.open()
	expect(warningCalled).toBe(true)

	console.warn = originalWarn

	modal1.close()
	await new Promise((resolve) => {
		setTimeout(() => {
			expect(modal1Element.style.display).toBe('')
			resolve(null)
		}, 400)
	})

	modal2.open()
	const modal2Element = document.querySelector('.modal') as HTMLElement
	expect(modal2Element).toBeDefined()
	expect(modal2Element.style.display).toBe('flex')

	modal2.close()
	await new Promise((resolve) => {
		setTimeout(() => {
			expect(modal2Element.style.display).toBe('')
			resolve(null)
		}, 400)
	})
})
