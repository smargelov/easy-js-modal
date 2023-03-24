# EasyJsModal

EasyJsModal is a lightweight and customizable modal window solution. It allows you to create a modal window with a few lines of code.

## Installation

To use EasyJsModal in your project, you can install it via npm:

```
npm install easy-js-modal
```

## Usage

To create a modal window, you need to instantiate the `EasyJsModal` class:

```js
import EasyJsModal from 'easy-js-modal'

const content = 'Hello, World!'

const modal = new EasyJsModal(content)
```

By default, the modal window will contain the provided `content` and will be displayed when the `open` method is called:

```js
modal.open()
```

To close the modal window, you can call the `close` method:

```js
modal.close()
```

To customize the modal window, you can pass a config object as the second parameter of the `EasyJsModal` constructor:

```js
const config = {
	animationDuration: 500,
	modalBlockClass: 'custom-modal'
}

const modal = new EasyJsModal(content, config)
```

This will change the animation duration to 500ms and apply the `custom-modal` class to the modal window.

## Configuration

The following options are available in the config object:

- `animationDuration` (number, default: 300): the animation duration in milliseconds.
- `modalBlockClass` (string, default: 'modal'): the class name of the modal container element.

## Methods

- `open()`: displays the modal window.
- `close()`: hides the modal window.

## License

MIT License
