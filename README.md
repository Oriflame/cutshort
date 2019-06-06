<div align="center">

[![npm][npm]][npm-url]

[![node][node]][node-url]
[![deps][deps]][deps-url]

[![downloads][downloads]][downloads-url]
[![install][install]][install-url]

# CutShort...

</div>

## Table of Contents

1. [Install](#install)
2. [Introduction](#introduction)
3. [Usage](#usage)
3. [Options](#options)
4. [Methods](#methods)
5. [Supported browsers](#supported-browsers)
6. [Development](#development)

<h2 align="center">Install</h2>

Install with npm:

```bash
npm install cutshort
```

Install with yarn:

```bash
yarn add cutshort
```


<h2 align="center">Introduction</h2>

CutShort is a libary that makes multiline oveflow easy.  

If your browser supports [css line-clamp](https://caniuse.com/css-line-clamp), CutShort will automaticly try to fallback into it.

<h2 align="center">Usage</h2>

```html
<span class="cut-short">Lorem ipsum...</span>
```

Now as you created element you want to use CutShort on you have 2 ways to initialize it:

```ts
import {CutShortFactory} from 'cutshort';

new CutShortFactory('.cut-short');
```

or 

```ts
import {CutShort} from 'cutshort';

new CutShort(document.querySelector('.cut-short'));
```

**After** you initalized CutShort it is possible to access the CutShort's instance on its HTMLElement. It is `cutShort` property of CutShort's HTML element:

```ts
const myCutShort = document.querySelector('.cutShort').cutShort;

// Now you can use all cutShort methods like
myCutShort.destroy();
```

**DISCLAMER**:
Don't use `CutShort` and `CutShortFactory` with quering that could target the same element. Trying to initalize CutShort on the same element twice will result in errors. 

<h2 align="center">Options</h2>

All options can be passes as attributes on the element. Attributes have higher priority over options.

### `lines {Number?}`
Maximum amount of lines that will be displayed inside `CutShort` container.

**Default**: `1`

**Attribute**: `cut-short-lines`

### `breakpoints {{[key: Number]: Number}}`
Allows to set different amount of displayed lines for different responsive breakpoints (screen sizes). For example:

```ts
{
	// when window width is >= 0px
    0: lines, // Always added if not supplied
    
	// when window width is >= 576px
    578: 2,
    
    // when window width is >= 768px
    768: 3
    
    // when window width is >= 992px
    992: 1
}
```

**Default**: `{0: lines}`

**Attribute**: `cut-short-breakpoints` (accepts only valid json format, in case of invalid json, error message is thrown)

<h2 align="center">Methods</h2>

### `excerpt(): Void`

Exerpt the content of the element CutShort got initialized on.

### `destroy(): Void`

Destroy the current instance of CutShort

### `get content: String`

Get full not excerpt content of the element CutShort got initialized on.

### `get options: {lines: Number, breakpoints: {[key: Number]: Number}}`

Get options of current CutShort instance.

### `set content(value: String)`

Set new content inside element with CutShort instance.

### `set options(value: {lines?: Number, breakpoints?: {[key: Number]: Number}})`

Set new options for current instance of CutShort.

<h2 align="center">Supported Browsers</h2>

As long browser you want to support has support for [mutationObserver](https://caniuse.com/mutationobserver) and [Set (part of ES6)](https://caniuse.com/ES6) you are good to go. In other way you need to install appropriate polyfills.


<h2 align="center">Development</h2>

This project uses [webpack 4](https://github.com/webpack/webpack) to compile typescript into javascript. Run `npm run watch` in terminal start a watch on typescript files and build everything after saving your changes.

[npm]: https://img.shields.io/npm/v/cutshort.svg
[npm-url]: https://npmjs.com/package/cutshort

[node]: https://img.shields.io/node/v/cutshort.svg
[node-url]: https://nodejs.org

[deps]: https://img.shields.io/david/witotv/cutshort.svg
[deps-url]: https://david-dm.org/witotv/cutshort

[install]: https://badgen.net/packagephobia/install/cutshort
[install-url]: https://packagephobia.now.sh/result?p=cutshort

[downloads]: https://img.shields.io/npm/dm/cutshort.svg
[downloads-url]: https://npmcharts.com/compare/cutshort?minimal=true
