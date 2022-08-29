<!--
SPDX-FileCopyrightText: 2022 Digital Dasein <https://digital-dasein.gitlab.io/>
SPDX-FileCopyrightText: 2022 Gerben Peeters <gerben@digitaldasein.org>
SPDX-FileCopyrightText: 2022 Senne Van Baelen <senne@digitaldasein.org>

SPDX-License-Identifier: MIT
-->

# \<dd-code>

[![pipeline](https://gitlab.com/digital-dasein/software/html-presentations/dd-code/badges/main/pipeline.svg?job=build&key_text=build)](https://gitlab.com/digital-dasein/software/html-presentations/dd-code/-/pipelines)
[![coverage](https://gitlab.com/digital-dasein/software/html-presentations/dd-code/badges/main/coverage.svg?job=test)](https://digital-dasein.gitlab.io/software/html-presentations/dd-code/lcov-report/)
[![REUSE 
status](https://api.reuse.software/badge/gitlab.com/digital-dasein/software/html-presentations/dd-code)](https://api.reuse.software/info/gitlab.com/digital-dasein/software/html-presentations/dd-code)


This webcomponent follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.

## Installation

```bash
yarn add @digitaldasein/dd-code
```
or

```bash
npm i @digitaldasein/dd-code
```

## Usage

As a module:

```html
<script type="module">
  import 'path/to/dd-code.js';
</script>

<dd-code>...</dd-code>
```

For a production-ready build, either integrated into a library or standalone, 
check out the
[libcompono](https://gitlab.com/digital-dasein/software/html-presentations/libcompono) 
library.

## Docs

&rarr; [go to 
docs](https://digital-dasein.gitlab.io/software/html-presentations/dd-code/docs/classes/DdCode.html)

## Local Demo with `web-dev-server`


```bash
yarn start
```

To run a local development server that serves the basic demo located in 
`demo/index.html`

### Highligh.js demo

To also demonstrate compatibility with the 
[highlighjs](https://highlightjs.org/) library, first run:

```sh
utils/get_hljs.sh
```

This downloads the appropriate files to de `demo` directory, and sets the 
required HTML header tags in the demo `index.html`.

## Linting and formatting

To scan the project for linting and formatting errors, run

```bash
yarn lint
```

To automatically fix linting and formatting errors, run

```bash
yarn format
```

## Testing with Web Test Runner

To execute a single test run:

```bash
yarn test
```

To run the tests in interactive watch mode run:

```bash
yarn test:watch
```
Test results are available 
[here](https://digital-dasein.gitlab.io/software/html-presentations/dd-code/lcov-report/).


## Tooling configs

For most of the tools, the configuration is in the `package.json` to reduce the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to 
individual files.