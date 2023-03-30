import { test, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
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

test('Modal applies custom styles', async () => {
	const content = '<p>Hello, world!</p>'
	const styles = {
		layoutBackgroundColor: 'rgba(255, 0, 0, 0.5)',
		windowBackgroundColor: '#ccc',
		windowWidth: '80%',
		windowMaxWidth: '600px',
		windowPadding: '1rem',
		windowBorderRadius: '1rem',
		closeFontSize: '1.5rem'
	}
	const animationDuration = 500
	const modal = new EasyJsModal(
		content,
		{
			animationDuration
		},
		styles
	)

	modal.open()
	const modalElement = document.querySelector('.modal') as HTMLElement
	const modalWindow = document.querySelector('.modal__window') as HTMLElement
	const closeButton = document.querySelector('.modal__close') as HTMLElement
	expect(modalElement).toBeDefined()
	expect(modalWindow).toBeDefined()
	expect(closeButton).toBeDefined()

	expect(
		modalElement.style.getPropertyValue('--ejm-layout-background-color')
	).toBe(styles.layoutBackgroundColor)
	expect(modalElement.style.getPropertyValue('--ejm-animation-duration')).toBe(
		`${animationDuration}ms`
	)
	expect(
		modalElement.style.getPropertyValue('--ejm-window-background-color')
	).toBe(styles.windowBackgroundColor)
	expect(modalElement.style.getPropertyValue('--ejm-window-width')).toBe(
		styles.windowWidth
	)
	expect(modalElement.style.getPropertyValue('--ejm-window-max-width')).toBe(
		styles.windowMaxWidth
	)
	expect(modalElement.style.getPropertyValue('--ejm-window-padding')).toBe(
		styles.windowPadding
	)
	expect(
		modalElement.style.getPropertyValue('--ejm-window-border-radius')
	).toBe(styles.windowBorderRadius)
	expect(modalElement.style.getPropertyValue('--ejm-close-font-size')).toBe(
		styles.closeFontSize
	)

	modal.close()
	await new Promise((resolve) => {
		setTimeout(() => {
			expect(modalElement.style.display).toBe('')
			resolve(null)
		}, animationDuration + 100)
	})
})

test('Modal traps focus within the modal', async () => {
	const content =
		'<p>Hello, world!</p> <button id="first">First</button> <button id="last">Last</button>'
	const modal = new EasyJsModal(content)

	modal.open()
	const modalElement = document.querySelector('.modal') as HTMLElement
	const firstButton = document.getElementById('first') as HTMLElement
	const lastButton = document.getElementById('last') as HTMLElement
	const closeButton = document.querySelector('.modal__close') as HTMLElement

	expect(document.activeElement).toBe(firstButton)
	await userEvent.tab()
	expect(document.activeElement).toBe(lastButton)

	// Focus on the first element and simulate pressing the Shift + Tab keys.
	firstButton.focus()
	await userEvent.tab({ shift: true })

	// The focus should move to the last focusable element.
	expect(document.activeElement).toBe(closeButton)

	modal.close()
	await new Promise((resolve) => {
		setTimeout(() => {
			expect(modalElement.style.display).toBe('')
			resolve(null)
		}, 400)
	})
})

test('Modal saves and restores focus state', async () => {
	const content = '<p>Hello, world!</p>'
	const modal = new EasyJsModal(content)

	const button1 = document.createElement('button')
	button1.textContent = 'Focusable Button 1'
	document.body.appendChild(button1)

	const button2 = document.createElement('button')
	button2.textContent = 'Focusable Button 2'
	document.body.appendChild(button2)

	button1.focus()
	expect(document.activeElement).toBe(button1)

	modal.open()
	const modalElement = document.querySelector('.modal') as HTMLElement

	expect(document.activeElement).not.toBe(button1)
	expect(document.activeElement).not.toBe(button2)

	modal.close()
	await new Promise((resolve) => {
		setTimeout(() => {
			expect(modalElement.style.display).toBe('')
			expect(document.activeElement).toBe(button1)
			resolve(null)
		}, 400)
	})

	button1.remove()
	button2.remove()
})

test('Modal restores focus state when there is no focusable element inside the modal', async () => {
	const content = '<p>Hello, world!</p>'
	const modal = new EasyJsModal(content)

	const button1 = document.createElement('button')
	button1.textContent = 'Focusable Button 1'
	document.body.appendChild(button1)

	button1.focus()
	expect(document.activeElement).toBe(button1)

	modal.open()
	const modalElement = document.querySelector('.modal') as HTMLElement

	modal.close()
	await new Promise((resolve) => {
		setTimeout(() => {
			expect(modalElement.style.display).toBe('')
			expect(document.activeElement).toBe(button1)
			resolve(null)
		}, 400)
	})

	button1.remove()
})

test('Modal calls onOpen and onClose callbacks', async () => {
	const content = '<p>Hello, world!</p>'

	let onOpenCalled = false
	let onCloseCalled = false

	const onOpen = () => {
		onOpenCalled = true
	}

	const onClose = () => {
		onCloseCalled = true
	}

	const modal = new EasyJsModal(content, { onOpen, onClose })

	modal.open()
	const modalElement = document.querySelector('.modal') as HTMLElement
	expect(modalElement).toBeDefined()
	expect(modalElement.style.display).toBe('flex')

	await new Promise((resolve) => {
		setTimeout(() => {
			expect(onOpenCalled).toBe(true)
			resolve(null)
		}, 500)
	})

	modal.close()
	await new Promise((resolve) => {
		setTimeout(() => {
			expect(modalElement.style.display).toBe('')
			expect(onCloseCalled).toBe(true)
			resolve(null)
		}, 500)
	})
})

test('Modal does not call onOpen and onClose callbacks if not provided', async () => {
	const content = '<p>Hello, world!</p>'

	const modal = new EasyJsModal(content)

	modal.open()
	const modalElement = document.querySelector('.modal') as HTMLElement
	expect(modalElement).toBeDefined()
	expect(modalElement.style.display).toBe('flex')

	modal.close()
	await new Promise((resolve) => {
		setTimeout(() => {
			expect(modalElement.style.display).toBe('')
			resolve(null)
		}, 400)
	})
})

test('Modal updates content with setContent', async () => {
	const initialContent = '<p>Initial content</p>'
	const newContent = '<p>New content</p>'
	const newContentElement = document.createElement('div')
	newContentElement.innerHTML = newContent
	const modal = new EasyJsModal(initialContent)

	modal.open()
	const modalWindow = document.querySelector('.modal__window') as HTMLElement
	expect(modalWindow.innerHTML).toContain(initialContent)

	const closeButton = modalWindow.querySelector('.modal__close') as HTMLElement
	expect(closeButton).toBeDefined()

	modal.setContent(newContentElement)
	expect(modalWindow.contains(newContentElement)).toBe(true)
	expect(modalWindow.querySelector('.modal__close')).toBe(closeButton)

	modal.close()
	await new Promise((resolve) => {
		setTimeout(() => {
			expect(document.querySelector('.modal')).toBeNull()
			resolve(null)
		}, 400)
	})
})
