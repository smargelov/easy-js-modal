import EasyJsModal from './EasyJsModal'

class ModalManager {
	private activeModal: EasyJsModal | null = null

	setActiveModal(modal: EasyJsModal): void {
		if (this.activeModal) {
			this.activeModal.close()
		}
		this.activeModal = modal
	}

	removeActiveModal(modal: EasyJsModal): void {
		if (this.activeModal === modal) {
			this.activeModal = null
		}
	}

	get isActiveModal(): boolean {
		return this.activeModal !== null
	}
}

const modalManager = new ModalManager()
export default modalManager
