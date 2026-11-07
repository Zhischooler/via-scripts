// ==UserScript==
// @name         志校儿翻译插件 | 免费 | Web 英文转换按钮
// @namespace    via.simple.translate
// @version      1.0.0
// @description  易用翻译插件，支持English转为中文（简体）
// @match        *://*/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  if (window.__viaSimpleTranslate) return;
  window.__viaSimpleTranslate = true;

  let box = null;

  function closeBox() {
    if (box) {
      box.remove();
      box = null;
    }
  }

  function show(msg) {
    closeBox();

    box = document.createElement('div');
    box.style.cssText = [
      'position:fixed',
      'left:12px',
      'right:12px',
      'bottom:180px',
      'max-height:60vh',
      'overflow:auto',
      'z-index:2147483647',
      'background:#fff',
      'color:#111',
      'border:1px solid #ccc',
      'border-radius:10px',
      'padding:12px 42px 12px 12px',
      'font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      'box-shadow:0 4px 20px rgba(0,0,0,.25)',
      'white-space:pre-wrap',
      'word-break:break-word'
    ].join(';');

    const close = document.createElement('div');
    close.textContent = '×';
    close.style.cssText =
      'position:absolute;right:8px;top:2px;font-size:30px;line-height:1;' +
      'cursor:pointer;color:#666;';
    close.addEventListener('click', closeBox);
    box.appendChild(close);

    const content = document.createElement('div');
    content.textContent = msg;
    box.appendChild(content);

    document.body.appendChild(box);
  }

  function init() {
    if (!document.body) {
      setTimeout(init, 100);
      return;
    }

    const btn = document.createElement('div');
    btn.textContent = '译';
    btn.title = '先选中要翻译的文字，再点这里';
    btn.style.cssText = [
      'position:fixed',
      'right:16px',
      'bottom:120px',
      'width:52px',
      'height:52px',
      'border-radius:50%',
      'background:#1a73e8',
      'color:#fff',
      'font-size:22px',
      'font-weight:bold',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'z-index:2147483647',
      'box-shadow:0 4px 14px rgba(0,0,0,.3)',
      'cursor:pointer',
      'user-select:none',
      '-webkit-user-select:none'
    ].join(';');

    btn.addEventListener('mousedown', function (e) {
      e.preventDefault();
    });

    btn.addEventListener('click', async function () {
      let text = '';
      const sel = window.getSelection();

      if (sel) {
        text = sel.toString().trim();
      }

      if (!text) {
        show('请先在网页中选中要翻译的文字，再点“译”。');
        return;
      }

      if (/[\u4e00-\u9fa5]/.test(text)) {
        show('你选中的内容里已经有中文。\n这个简易脚本只做“外文 → 中文”，请选中英文等外文再试。');
        return;
      }

      let cut = false;

      if (text.length > 450) {
        text = text.slice(0, 450);
        cut = true;
      }

      show('翻译中…');

      try {
        const url =
          'https://api.mymemory.translated.net/get?q=' +
          encodeURIComponent(text) +
          '&langpair=en%7Czh-CN';

        const res = await fetch(url);

        if (!res.ok) {
          throw new Error('网络返回 ' + res.status);
        }

        const data = await res.json();
        const out =
          data &&
          data.responseData &&
          data.responseData.translatedText;

        if (!out) {
          throw new Error('接口没有返回译文');
        }

        show(
          (cut ? '（原文太长，只翻译了前450个字符）\n\n' : '') +
          '原文：\n' +
          text +
          '\n\n译文：\n' +
          out
        );
      } catch (e) {
        show(
          '翻译失败：' +
          (e && e.message ? e.message : e) +
          '\n\n可以稍后再试，或换一个网络。'
        );
      }
    });

    document.body.appendChild(btn);
  }

  init();
})();
