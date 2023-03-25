# EasyJsModal

EasyJsModal is a lightweight, easy-to-use, and customizable modal window solution for modern web applications. This library allows you to create a modal window with minimal code and offers seamless integration.

## Features
* Lightweight and minimal footprint
* Easily customizable
* Supports multiple integration options (npm, CDN)
* No dependencies required
* Responsive design
* Accessible and user-friendly
* Future development plans for nested modals, improved accessibility, and style customization through configuration

## Installation

### Via NPM

To use EasyJsModal in your project, you can install it via npm:

```bash
npm install easy-js-modal
```

### Via CDN

Include the following script and stylesheet in the `<head>` section of your HTML file:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/easy-js-modal/dist/style.min.css">
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

## Demo
* [Demo with npm integration](https://codepen.io/smargelov/pen/PodXXYw)
* [Demo with CDN integration](https://codepen.io/smargelov/pen/jOvXXOy)

## Future Development Plans
* Support for nested modals (modals within modals)
* Enhanced accessibility features
* Style customization through configuration options

## Browser Support

EasyJsModal is designed to work with modern web browsers, including:

* Chrome 49+
* Firefox 45+
* Safari 10+
* Edge 16+

**Please note** that EasyJsModal has **not been tested in Internet Explorer 11** and might not work properly due to the library relying on features not available in this outdated browser.

For the best user experience, we recommend using the latest version of your preferred web browser.

## License

MIT License
