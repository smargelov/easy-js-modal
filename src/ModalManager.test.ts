import { test, expect, afterEach, beforeEach } from 'vitest'
import { EasyJsModal } from './EasyJsModal'
import modalManager from './ModalManager'

const content = '<p>Hello, world!</p>'
let modal: EasyJsModal
beforeEach(() => {
	modal = new EasyJsModal(content)
	modal.open()
})
afterEach(() => {
	modal.close()
})

test('Modal manager is adding active modal', async () => {
	expect(modalManager.isActiveModal).toBe(true)
})

test('Modal manager is removing active modal', async () => {
	expect(modalManager.isActiveModal).toBe(true)
	modal.close()
	expect(modalManager.isActiveModal).toBe(false)
})

test('Modal manager is return isActiveModal value', async () => {
	expect(modalManager.isActiveModal).toBe(true)
	modal.close()
	expect(modalManager.isActiveModal).toBe(false)
})
