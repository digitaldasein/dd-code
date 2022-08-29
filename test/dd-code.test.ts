// SPDX-FileCopyrightText: 2022 Digital Dasein <https://digitaldasein.org/>
// SPDX-FileCopyrightText: 2022 Gerben Peeters <gerben@digitaldasein.org>
// SPDX-FileCopyrightText: 2022 Senne Van Baelen <senne@digitaldasein.org>
//
// SPDX-License-Identifier: MIT

import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';
import { DdCode } from '../src/DdCode.js';
import '../src/dd-code.js';

/*---------------------------------------------------------------------*/
/* Config                                                              */
/*---------------------------------------------------------------------*/

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*---------------------------------------------------------------------*/
/* Test                                                                */
/*---------------------------------------------------------------------*/

describe('DdCode', () => {
  it('set highlight', async () => {
    const el = await fixture<DdCode>(html`
        <dd-code highlight="1,2">
          mycode
          can
          go here
        </dd-code>`);
    expect(el.hl).to.equal("1,2");
    const codeSlot = await el.shadowRoot!.querySelector('.codeblock');
    expect(codeSlot?.querySelector(".code-hl")).to.not.equal(null);
  });

  it('check highlight alias', async () => {
    const el = await fixture<DdCode>(html`
        <dd-code highlight="1,4-5">
          mycode
          can
          go here
        </dd-code>`);
    expect(el.hl).to.equal("1,4-5");
  });

  it('set bold', async () => {
    const el = await fixture<DdCode>(html`
        <dd-code bold="1-3">
          mycode
          can
          go here
        </dd-code>`);
    expect(el.bold).to.equal("1-3");
    const codeSlot = await el.shadowRoot!.querySelector('.codeblock');
    expect(codeSlot?.querySelector(".code-bold")).to.not.equal(null);
  });

  it('set italic', async () => {
    const el = await fixture<DdCode>(html`
        <dd-code italic="3">
          mycode
          can
          go here
        </dd-code>`);
    expect(el.italic).to.equal("3");
    const codeSlot = await el.shadowRoot!.querySelector('.codeblock');
    expect(codeSlot?.querySelector(".code-italic")).to.not.equal(null);
  });

  it('set color', async () => {
    const el = await fixture<DdCode>(html`
    <dd-code bg-color=blue fg-color=black></dd-code>`);
    expect(el.bgColor).to.equal("blue");
    expect(el.fgColor).to.equal("black");
  });

  it('set lang', async () => {
    const el = await fixture<DdCode>(html`
    <dd-code lang=HTML></dd-code>`);
    expect(el.lang).to.equal("HTML");
  });

  it('set booleans', async () => {
    const el = await fixture<DdCode>(html`
    <dd-code line-nrs no-trim>mycode</dd-code>`);
    expect(el.lineNrs).to.equal(true);
    expect(el.noTrim).to.equal(true);
    expect(el.shadowRoot!.querySelector('.line-nr')).to.not.equal(null);
  });

  it('inline markup', async () => {
    const el = await fixture<DdCode>(html`
    <dd-code>
        !const contentLoaded = (callback) => {
        !!!    if (document.currentScript.async) {
        !        callback();
        !!    } else {
                document.addEventListener('DOMContentLoaded', callback);
            }
        };
    </dd-code>`);
    const codeSlot = await el.shadowRoot!.querySelector('.codeblock');
    await timeout(300);
    expect(codeSlot?.querySelector(".code-hl")).to.not.equal(null);
    expect(codeSlot?.querySelector(".code-bold")).to.not.equal(null);
    expect(codeSlot?.querySelector(".code-italic")).to.not.equal(null);
  });

  it('passes the a11y audit', async () => {
    const el = await fixture<DdCode>(html`<dd-code></dd-code>`);
    await expect(el).shadowDom.to.be.accessible();
  });

});
