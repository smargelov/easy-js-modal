import modalManager from './ModalManager'

const enableScroll = (): void => {
	document.body.style.paddingRight = ''
	document.body.style.overflow = ''
}

const calculateScrollbarWidth = (): number => {
	const outer = document.createElement('div')
	outer.style.visibility = 'hidden'
	outer.style.width = '100px'
	outer.style.overflow = 'scroll'
	document.body.appendChild(outer)

	const inner = document.createElement('div')
	inner.style.width = '100%'
	outer.appendChild(inner)

	const scrollbarWidth = outer.offsetWidth - inner.offsetWidth

	outer.remove()
	return scrollbarWidth
}

const convertCamelToPrefixedKebabCase = (camelCaseString: string): string => {
	if (typeof camelCaseString !== 'string') {
		throw new Error('The input should be a string.')
	}

	const kebabCaseString = camelCaseString
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.toLowerCase()
	return `--ejm-${kebabCaseString}`
}

interface ModalConfig {
	animationDuration: number
	modalBlockClass: string
	onOpen?: () => void
	onClose?: () => void
}

interface ModalStylesConfig {
	layoutBackgroundColor: string
	windowBackgroundColor: string
	windowWidth: string
	windowMaxWidth: string
	windowPadding: string
	windowBorderRadius: string
	closeFontSize: string
}

interface ModalStyles extends ModalStylesConfig {
	animationDuration: string
}

export class EasyJsModal {
	private modalElement: HTMLElement

	private modalWindow: HTMLElement

	private scrollbarWidth: number

	private modalBlockClass: string

	private closeButtonClass: string

	private animationDuration: number

	private modalWindowClass: string

	private onOpen?: () => void

	private onClose?: () => void

	private modalStyles: ModalStyles

	private openTimeout: ReturnType<typeof setTimeout> | null = null

	private closeTimeout: ReturnType<typeof setTimeout> | null = null

	constructor(
		content: string | HTMLElement,
		config?: Partial<ModalConfig>,
		styles?: Partial<ModalStylesConfig>
	) {
		this.onOpen = config?.onOpen
		this.onClose = config?.onClose
		this.modalBlockClass = config?.modalBlockClass || 'modal'
		this.animationDuration = config?.animationDuration || 300
		this.closeButtonClass = `${this.modalBlockClass}__close`
		this.modalWindowClass = `${this.modalBlockClass}__window`
		this.modalStyles = {
			layoutBackgroundColor:
				styles?.layoutBackgroundColor || 'rgba(0, 0, 0, 0.5)',
			animationDuration: `${this.animationDuration}ms`,
			windowBackgroundColor: styles?.windowBackgroundColor || '#fff',
			windowWidth: styles?.windowWidth || '90%',
			windowMaxWidth: styles?.windowMaxWidth || '500px',
			windowPadding: styles?.windowPadding || '2rem',
			windowBorderRadius: styles?.windowBorderRadius || '0.5rem',
			closeFontSize: styles?.closeFontSize || '1.25rem'
		}

		this.modalWindow = this.createModalWindow(content)
		this.modalElement = this.createModalElement()

		this.scrollbarWidth = calculateScrollbarWidth()
		this.init()
	}

	private init(): void {
		if (modalManager.isActiveModal) {
			console.warn(
				'Another modal is already open. Please close it before opening a new one.'
			)
			return
		}
		document.body.appendChild(this.modalElement)
	}

	private createModalElement(): HTMLElement {
		const modalElement = document.createElement('div')
		modalElement.classList.add(this.modalBlockClass)
		modalElement.appendChild(this.modalWindow)
		return modalElement
	}

	private createModalWindow(content: string | HTMLElement): HTMLElement {
		const modalWindow = document.createElement('div')
		modalWindow.classList.add(this.modalWindowClass)
		const closeButton = `<button class="${this.closeButtonClass}">×</button>`
		modalWindow.innerHTML =
			(typeof content === 'string' ? content : content.outerHTML) + closeButton
		return modalWindow
	}

	private getStylesForModal(): string[] {
		return Object.entries(this.modalStyles).map(
			([key, value]) => `${convertCamelToPrefixedKebabCase(key)}: ${value};`
		)
	}

	open(): void {
		if (modalManager.isActiveModal) {
			console.warn(
				'Another modal is already open. Please close it before opening a new one.'
			)
			return
		}

		this.modalElement.style.cssText = this.getStylesForModal().join(' ')
		this.modalElement.style.display = 'flex'
		this.openTimeout = setTimeout(() => {
			this.modalElement.classList.add(`${this.modalBlockClass}--visible`)
			this.modalWindow.classList.add(`${this.modalWindowClass}--visible`)
			if (this.onOpen) {
				this.onOpen()
			}
			if (this.openTimeout !== null) {
				clearTimeout(this.openTimeout)
				this.openTimeout = null
			}
		}, this.animationDuration + 50)
		this.disableScroll()
		this.addEventListeners()
		modalManager.focusableElementBeforeModal =
			document.activeElement as HTMLElement

		const firstInteractiveElement = this.modalWindow.querySelector(
			'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
		)
		if (firstInteractiveElement) {
			;(firstInteractiveElement as HTMLElement).focus()
		}
		modalManager.setActiveModal(this)
	}

	close(): void {
		this.modalElement.classList.remove(`${this.modalBlockClass}--visible`)
		this.modalWindow.classList.remove(`${this.modalWindowClass}--visible`)
		enableScroll()
		this.closeTimeout = setTimeout(() => {
			this.modalElement.style.display = ''
			this.removeEventListeners()
			this.destroy()
			if (this.onClose) {
				this.onClose()
			}
			if (this.closeTimeout !== null) {
				clearTimeout(this.closeTimeout)
				this.closeTimeout = null
			}
		}, this.animationDuration + 50)
		modalManager.focusableElementBeforeModal?.focus()
		modalManager.removeActiveModal(this)
	}

	private destroy(): void {
		this.modalElement.remove()
	}

	private addEventListeners(): void {
		this.modalElement
			.querySelector(`.${this.closeButtonClass}`)!
			.addEventListener('click', () => this.close())
		this.modalElement.addEventListener('click', (event) => {
			if (event.target === this.modalElement) {
				this.close()
			}
		})
		document.addEventListener('keydown', this.handleKeyDown)
	}

	private removeEventListeners(): void {
		this.modalElement
			.querySelector(`.${this.closeButtonClass}`)!
			.removeEventListener('click', () => this.close())
		this.modalElement.removeEventListener('click', (event) => {
			if (event.target === this.modalElement) {
				this.close()
			}
		})
		document.removeEventListener('keydown', this.handleKeyDown)
	}

	private handleKeyDown = (event: KeyboardEvent): void => {
		if (event.key === 'Escape') {
			this.close()
		}
		this.trapFocus(event)
	}

	private disableScroll(): void {
		document.body.style.paddingRight = `${this.scrollbarWidth}px`
		document.body.style.overflow = 'hidden'
	}

	private trapFocus(event: KeyboardEvent): void {
		if (event.key !== 'Tab') {
			return
		}

		const focusableElements = this.getFocusableElements()
		const firstFocusableElement = focusableElements[0]
		const lastFocusableElement = focusableElements[focusableElements.length - 1]

		if (event.shiftKey) {
			if (document.activeElement === firstFocusableElement) {
				lastFocusableElement.focus()
				event.preventDefault()
			}
		} else if (document.activeElement === lastFocusableElement) {
			firstFocusableElement.focus()
			event.preventDefault()
		}
	}

	private getFocusableElements(): HTMLElement[] {
		const focusableElementsSelector = `
      a[href],
      button:not([disabled]),
      textarea:not([disabled]),
      input[type="text"]:not([disabled]),
      input[type="radio"]:not([disabled]),
      input[type="checkbox"]:not([disabled]),
      select:not([disabled])
    `
		const focusableElements = Array.from(
			this.modalElement.querySelectorAll(focusableElementsSelector)
		) as HTMLElement[]

		return focusableElements.filter(
			(el) => !el.hasAttribute('tabindex') || el.tabIndex >= 0
		)
	}
}

export default EasyJsModal
