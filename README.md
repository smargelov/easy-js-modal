# EasyJsModal

EasyJsModal is a lightweight and customizable modal window solution. It allows you to create a modal window with a few lines of code.

## Features

- Easy to use and integrate into your project
- Customizable appearance using configuration
- Supports keyboard navigation and traps focus within the modal
- No dependencies, lightweight, and efficient

## Installation

### Via NPM

To use EasyJsModal in your project, you can install it via npm:

```bash
npm install easy-js-modal
```

### Via CDN

Include the following script and stylesheet in the `<head>` section of your HTML file:

```html
<link
	rel="stylesheet"
	href="https://cdn.jsdelivr.net/npm/easy-js-modal/dist/style.min.css"
/>
<script src="https://cdn.jsdelivr.net/npm/easy-js-modal/dist-iife/easy-js-modal.min.js"></script>
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

To customize the modal window, you can pass a config object as the second parameter of the `EasyJsModal` constructor. Additionally, you can customize the appearance of the modal window by passing a `styles` object as the third parameter:

```js
const config = {
	animationDuration: 500,
	modalBlockClass: 'custom-modal'
}

const styles = {
	layoutBackgroundColor: 'rgba(0, 0, 0, 0.7)',
	windowBackgroundColor: '#f0f0f0',
	windowWidth: '80%',
	windowMaxWidth: '600px',
	windowPadding: '1.5rem',
	windowBorderRadius: '1rem',
	closeFontSize: '1.5rem'
}

const modal = new EasyJsModal(content, config, styles)
```

This will change the animation duration to 500ms and apply the `custom-modal` class to the modal window.

## Configuration

The following options are available in the config object:

- `animationDuration` (number, default: 300): the animation duration in milliseconds.
- `modalBlockClass` (string, default: 'modal'): the class name of the modal container element.
- `onOpen` (function, optional): a callback function that is called when the modal is opened.
- `onClose` (function, optional): a callback function that is called when the modal is closed.

## Styles

The following options are available in the styles object:

- `layoutBackgroundColor` (string, default: 'rgba(0, 0, 0, 0.5)'): background color of the modal layout.
- `windowBackgroundColor` (string, default: '#fff'): background color of the modal window.
- `windowWidth` (string, default: '90%'): width of the modal window.
- `windowMaxWidth` (string, default: '500px'): maximum width of the modal window.
- `windowPadding` (string, default: '2rem'): padding inside the modal window.
- `windowBorderRadius` (string, default: '0.5rem'): border radius of the modal window.
- `closeFontSize` (string, default: '1.25rem'): font size of the close button.

## Methods

- `open()`: displays the modal window.
- `close()`: hides the modal window.

## Browser Support

EasyJsModal has been tested and works in modern browsers like Chrome, Firefox, Safari, and Edge. Internet Explorer 11 is not officially supported and may not work as expected.

## Demo

Visit our demo pages to see EasyJsModal in action with different configurations:

- [Demo with npm integration](https://codepen.io/smargelov/pen/PodXXYw)
- [Demo with CDN integration](https://codepen.io/smargelov/pen/jOvXXOy)

## Future Development

We have plans to further enhance EasyJsModal, including:

- Allowing modals to be called from within other modals
- Improving accessibility features
- Allowing more customization options through configuration

We welcome contributions and suggestions to improve this project. Feel free to open issues or submit pull requests on the [GitHub repository](https://github.com/smargelov/easy-js-modal).

## License

MIT License
