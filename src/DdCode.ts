// SPDX-FileCopyrightText: 2022 Digital Dasein <https://digitaldasein.org/>
// SPDX-FileCopyrightText: 2022 Gerben Peeters <gerben@digitaldasein.org>
// SPDX-FileCopyrightText: 2022 Senne Van Baelen <senne@digitaldasein.org>
//
// SPDX-License-Identifier: MIT

import { html, css, LitElement } from 'lit';
import { property } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

const DEFAULT_ATTRIBUTES = {
  hl: '',
  italic: '',
  bold: '',
  bgColor: '#f3f3f3',
  fgColor: 'black',
  lineNrs: false,
  noTrim: false,
  lang: '',
};

/**
 * Main class for HTML web component **`dd-code`**
 *
 * For **styling** this component, check out {@link DdCode.styles |
 * the styles section}.
 *
 * <u>**Important note**</u>: all lit-component properties (interpreted here as
 * `other properties`) that are documented here have a **corresponding
 * HTML attribute**. The _non-attribute_ properties are consired private,
 * and are ingored in the documentation.
 *
 * @example
 * Highlight line 1, bold line 2, and italic line 3, and highlight lines 5 and 6
 *
 * ```html
 * <html>
 *   [...]
 *   <dd-code line-nrs hl="1,5-6" bold=2 italic=3>
 *      const contentLoaded = (callback) => {
 *          if (document.currentScript.async) {
 *              callback();
 *          } else {
 *              document.addEventListener('DOMContentLoaded', callback);
 *          }
 *      };
 *   </dd-code>
 *   [...]
 * </html>
 * ```
 *
 * @example
 * Exact same output as previous example, now using "!" to set markup
 *
 * ```html
 * <html>
 *   [...]
 *   <dd-code line-nrs>
 *      !!!const contentLoaded = (callback) => {
 *      !!    if (document.currentScript.async) {
 *      !        callback();
 *          } else {
 *      !!!        document.addEventListener('DOMContentLoaded', callback);
 *      !!!    }
 *      };
 *   </dd-code>
 *   [...]
 * </html>
 * ```
 *
 * @example
 * Use HTML "as-is", i.e., HTML markup characteres (&gt; and &lt;) will automatically
 * be replaced
 *
 * ```html
 * <html>
 *   [...]
 *   <dd-code>
 *      <h2>Automatically escaping HTML markup tags</h2>
 *      <div class="myclass">
 *        <p>And a p element</p>
 *      </div>
 *   </dd-code>
 *   [...]
 * </html>
 * ```
 *
 */

export class DdCode extends LitElement {
  /**
   * To style the `dd-code` component, use the following **CSS host
   * variables** (including their default values):
   *
   * |  <div style="width:200px">CSS variable</div>   | <div style="width:200px">Default</div>   | Description |
   * |:-----------------------------------------------|:-----------------------------------------|:------------|
   * |**`--dd-code-color-hl`**          |`rgba(251, 247, 25, 0.8)`    | highlight color             |
   * |**`--dd-code-line-height`**       |`1.2em`    | line height for codeblock             |
   * |**`--dd-code-font-size`**         |`0.85em` | font-size of text inside `dd-code`                     |
   * |**`--dd-code-padding`**           |`1em`    | padding for codeblock  (can be set for top,right,bottom,left)    |
   * |**`--dd-code-margin`**            |`0.5em 0 0.5em 0`    | margin for codeblock    |
   * |**`--dd-code-padding-line-nr`**   |`1.5em`    | right padding for line numbers (space between nr and code)  |
   * |**`--dd-code-color-bg`**          |`#f3f3f3`   | codeblock background color |
   * |**`--dd-code-color-fg`**          |`black`    | codeblock foreground (text) color |
   * |**`--dd-code-color-lang`**        |`rgba(0,0,0,0.6)`    | color for language indicator |
   *
   * The variables can be set anywhere in your HTML context (e.g. in `:root`,
   * up until the `dd-code` component itself).
   *
   */

  static styles = css`
    :host {
      --color-hl: var(--dd-code-color-hl, rgba(251, 247, 25, 0.8));
      --line-height: var(--dd-code-line-height, 1em);
      --padding: var(--dd-code-padding, 1em);
      --margin: var(--dd-code-margin, 0.5em 0 0.5em 0);
      --line-nr-padding: var(--dd-code-padding-line-nr, 1em);
      --color-bg: var(--dd-code-color-bg, #f3f3f3);
      --color-fg: var(--dd-code-color-fg, black);
      --color-lang: var(--dd-code-color-lang, rgba(0, 0, 0, 0.6));
      --font-size: var(--dd-code-font-size, 1.85em);
    }

    .codeblock {
      font-family: 'Roboto Mono', monospace;
    }

    pre {
      padding: var(--padding);
      line-height: var(--line-height);
      background-color: var(--color-bg);
      color: var(--color-fg);
      margin: var(--margin);
      overflow-x: scroll;
      font-size: var(--font-size);
    }

    code {
      padding-left: var(--padding-left);
    }

    .code-hl {
      background-color: var(--color-hl);
    }
    .code-bold {
      font-weight: bold;
    }
    .code-italic {
      font-style: italic;
    }

    .line-nr {
      display: inline-block;
      font-weight: normal;
      font-style: normal;
      padding-right: 0.3em;
      margin-right: var(--line-nr-padding);
      min-width: 1.2em;
      border-right: 1px solid rgba(0, 0, 0, 0.2);
      line-height: 1.55em;
    }

    .code-container {
      font-family: 'Roboto Mono', monospace;
      position: relative;
    }
    .lang {
      position: absolute;
      top: 7px;
      right: 7px;
      font-size: calc(0.85 * var(--font-size));
      color: var(--color-lang);
      line-height: 1em;
    }
  `;

  /**
   * Comma-separated set of lines which need to be highlighted
   * - for a range, use a dash, e.g.: 2-5
   * - for all, use hl="all"
   *
   * **Corresponding attribute:** `hl`
   *
   * **Default value:** `""` (empty string)
   *
   * Example: `hl="3,4,6-10"`
   *
   * **Alternative**: put `!!!` before the line of code (at column 0)
   * (see also example above)
   *
   */
  @property({ type: String, attribute: 'hl' })
  hl = DEFAULT_ATTRIBUTES.hl;

  /**
   * Comma-separated set of lines which need to be styled _italic_
   * - for a range, use a dash, e.g.: 2-5
   *
   * **Corresponding attribute:** `italic`
   *
   * **Default value:** `""` (empty string)
   *
   * Example: `italic="3,4,6-10"`
   *
   * **Alternative**: put `!` before the line of code (at column 0)
   * (see also example above)
   *
   */
  @property({ type: String, attribute: 'italic' })
  italic = DEFAULT_ATTRIBUTES.italic;

  /**
   * Comma-separated set of lines which need to be styled **bold**
   * - for a range, use a dash, e.g.: 2-5
   *
   * **Corresponding attribute:** `bold`
   *
   * **Default value:** `""` (empty string)
   *
   * Example: `bold="3,4,6-10"`
   *
   * **Alternative**: put `!!` before the line of code (at column 0)
   * (see also example above)
   *
   */
  @property({ type: String, attribute: 'bold' })
  bold = DEFAULT_ATTRIBUTES.bold;

  /**
   * Background color of code snippet
   * Can also be set globally with the CSS variable `--dd-code-color-bg`
   *
   * **Corresponding attribute:** `bg-color`
   *
   * **Default value:** `#f3f3f3`
   *
   * To remove background color, set to "none"
   *
   */
  @property({ type: String, attribute: 'bg-color' })
  bgColor = DEFAULT_ATTRIBUTES.bgColor;

  /**
   * Foreground (text) color of code snippet
   *
   * **Corresponding attribute:** `fg-color`
   *
   * **Default value:** `black`
   *
   * NOTE: Can also be set globally with the CSS variable `--dd-code-color-fg`
   */
  @property({ type: String, attribute: 'fg-color' })
  fgColor = DEFAULT_ATTRIBUTES.fgColor;

  /**
   * Language (which will show on the right top of the code snippet)
   *
   * **Corresponding attribute:** `lang`
   *
   * **Default value:** `""` (empty string)
   */
  @property({ type: String, attribute: 'lang' })
  lang = DEFAULT_ATTRIBUTES.lang;

  /**
   * Line numbers (toggle on/off)
   *
   * **Corresponding attribute:** `line-nrs`
   *
   * **Default value:** `false`
   */
  @property({ type: Boolean, attribute: 'line-nrs' })
  lineNrs = DEFAULT_ATTRIBUTES.lineNrs;

  /**
   * Do not trim (white spaces and newlines)
   *
   * **Corresponding attribute:** `no-trim`
   *
   * **Default value:** `false`
   *
   * By default, the first line of code is set to the first **non**-whitespace
   * (or newline) character within `<dd-code>`. This is moreover used as the
   * "base column" for indentation (upper-left).
   */
  @property({ type: Boolean, attribute: 'no-trim' })
  noTrim = DEFAULT_ATTRIBUTES.noTrim;

  /**
   * Alias for {@link DdCode.hl }
   *
   * **Corresponding attribute:** `highlight`
   *
   * **Default value:** `""` (empty string)
   */
  @property({ type: String, attribute: 'highlight' })
  highlight = DEFAULT_ATTRIBUTES.hl;

  /** @ignore */
  @property({ type: String })
  codeHtml = '';

  /* Make codo block */
  /*
   makeCodeBlock() {
     // re-initialise in case of multiple renders
   }

   */

  _getMarkupLinesFromString() {
    const _range = (size: Number, startAt = 0) =>
      [...Array(size).keys()].map(i => i + startAt);

    const _computeNrArr = (prop: string) => {
      const arr: Number[] = [];
      if (prop) {
        const lines = prop.split(',');
        for (const sNr of lines) {
          const nr = Number(sNr.trim());
          if (!Number.isNaN(nr)) arr.push(nr);
          else {
            const range = sNr.split('-');
            if (range.length === 2) {
              const start = Number(range[0].trim());
              const end = Number(range[1].trim());
              if (!Number.isNaN(start) && !Number.isNaN(end))
                arr.push(..._range(end - start + 1, start));
            }
          }
        }
      }
      return arr;
    };

    const hlLinesArr = _computeNrArr(this.hl);
    const boldLinesArr = _computeNrArr(this.bold);
    const italicLinesArr = _computeNrArr(this.italic);

    return { hlLinesArr, boldLinesArr, italicLinesArr };
  }

  handleSlotChange(e: Event) {
    const childNodes = (e.target as HTMLSlotElement).assignedNodes({
      flatten: true,
    });
    const codeNode = childNodes[0];

    /* c8 ignore next */
    if (!codeNode.textContent) return;

    let codeString = codeNode.textContent;
    // contain more than just #text node (interpreted as HTML markup)

    if (this.childNodes.length > 1 || this.lang.toUpperCase() === 'HTML') {
      codeString = this.innerHTML;
      codeString = codeString.replace(/</g, '&lt;');
      codeString = codeString.replace(/>/g, '&gt;');
    }

    let allCode = codeString;
    if (!this.noTrim) allCode = allCode.replace(/^\n|\n$/g, '');
    const allCodeLines = allCode.split('\n');

    let indent = 0;
    const firstLine = allCodeLines[0].split(' ');
    if (!this.noTrim) {
      for (const checkSpace of firstLine) {
        if (checkSpace !== '') break;
        indent++;
      }
    }

    if (
      allCodeLines[allCodeLines.length - 1].trim().length === 0 &&
      !this.noTrim
    )
      allCodeLines.pop();

    const markup = this._getMarkupLinesFromString();

    const codeLines = [];
    for (const [idx, codeLine] of allCodeLines.entries()) {
      const line = codeLine.slice(indent);
      let lineNr = ``;
      if (this.lineNrs) lineNr = `<code class="line-nr">${idx + 1}</code>`;
      if (codeLine.substring(indent, indent + 3) === '!!!')
        codeLines.push(
          `${lineNr}<code class="code-hl">${line.slice(3)}</code>`
        );
      else if (markup.hlLinesArr.includes(idx + 1))
        codeLines.push(`${lineNr}<code class="code-hl">${line}</code>`);
      else if (codeLine.substring(indent, indent + 2) === '!!')
        codeLines.push(
          `${lineNr}<code class="code-bold">${line.slice(2)}</code>`
        );
      else if (markup.boldLinesArr.includes(idx + 1))
        codeLines.push(`${lineNr}<code class="code-bold">${line}</code>`);
      else if (codeLine.substring(indent, indent + 1) === '!')
        codeLines.push(
          `${lineNr}<code class="code-italic">${line.slice(1)}</code>`
        );
      else if (markup.italicLinesArr.includes(idx + 1))
        codeLines.push(`${lineNr}<code class="code-italic">${line}</code>`);
      else codeLines.push(`<code>${lineNr}${line}</code>`);
    }

    this.codeHtml = codeLines.join('\n');

    if (this.bgColor) this.style.setProperty('--color-bg', this.bgColor);
    if (this.fgColor) this.style.setProperty('--color-fg', this.fgColor);
  }

  async firstUpdated() {
    // console.log(this._slottedChildren);
    // let text = this._slottedChildren[1];
    // console.log(text[0])
  }

  protected render() {
    // alias
    if (this.highlight) this.hl = this.highlight;

    return html`
      <slot style="display:none;" @slotchange="${this.handleSlotChange}"></slot>
      <div class="code-container">
        <div class="lang">${this.lang}</div>
        ${unsafeHTML(`<pre class="codeblock">${this.codeHtml}</pre>`)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'dd-code': DdCode;
  }
}
