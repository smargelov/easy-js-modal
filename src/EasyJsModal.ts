interface ModalConfig {
	animationDuration: number
	modalBlockClass: string
}

export class EasyJsModal {
	private modalElement: HTMLElement
	private modalWindow: HTMLElement
	private scrollbarWidth: number
	private modalBlockClass: string
	private closeButtonClass: string
	private animationDuration: number
	private modalWindowClass: string
	private openTimeout: any = null
	private closeTimeout: any = null

	constructor(content: string | HTMLElement, config?: Partial<ModalConfig>) {
		this.modalBlockClass = config?.modalBlockClass || 'modal'
		this.animationDuration = config?.animationDuration || 300
		this.closeButtonClass = `${this.modalBlockClass}__close`
		this.modalWindowClass = `${this.modalBlockClass}__window`

		this.modalWindow = this.createModalWindow(content)
		this.modalElement = this.createModalElement()

		this.scrollbarWidth = this.calculateScrollbarWidth()
		this.init()
	}

	private init(): void {
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
			closeButton + (typeof content === 'string' ? content : content.outerHTML)
		return modalWindow
	}

	open(): void {
		this.modalElement.style.display = 'flex'
		this.openTimeout = setTimeout(() => {
			this.modalElement.classList.add(`${this.modalBlockClass}--visible`)
			this.modalWindow.classList.add(`${this.modalWindowClass}--visible`)
			clearTimeout(this.openTimeout)
			this.openTimeout = null
		}, this.animationDuration + 50)
		this.disableScroll()
		this.addEventListeners()
	}

	close(): void {
		this.modalElement.classList.remove(`${this.modalBlockClass}--visible`)
		this.modalWindow.classList.remove(`${this.modalWindowClass}--visible`)
		this.enableScroll()
		this.closeTimeout = setTimeout(() => {
			this.modalElement.style.display = ''
			this.removeEventListeners()
			this.destroy()
			clearTimeout(this.closeTimeout)
			this.closeTimeout = null
		}, this.animationDuration + 50)
	}

	destroy(): void {
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

	private calculateScrollbarWidth(): number {
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

	private disableScroll(): void {
		document.body.style.paddingRight = `${this.scrollbarWidth}px`
		document.body.style.overflow = 'hidden'
	}

	private enableScroll(): void {
		document.body.style.paddingRight = ''
		document.body.style.overflow = ''
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
		} else {
			if (document.activeElement === lastFocusableElement) {
				firstFocusableElement.focus()
				event.preventDefault()
			}
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