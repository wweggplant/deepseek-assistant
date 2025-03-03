// ==UserScript==
// @name         DeepSeek Share (油猴版)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为DeepSeek Chat添加分享功能
// @author       You
// @match        https://chat.deepseek.com/*
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @resource     loadingSVG assets/loading.svg
// @license      MIT
// ==/UserScript==

(function() {
  'use strict';

  const loadingSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="200" height="200" style="shape-rendering: auto; display: block; background: rgb(255, 255, 255);" xmlns:xlink="http://www.w3.org/1999/xlink"><g><g transform="rotate(0 50 50)">
              <rect fill="#585253" height="12" width="6" ry="6" rx="3" y="24" x="47">
                <animate repeatCount="indefinite" begin="-0.9166666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
              </rect>
            </g><g transform="rotate(30 50 50)">
              <rect fill="#585253" height="12" width="6" ry="6" rx="3" y="24" x="47">
                <animate repeatCount="indefinite" begin="-0.8333333333333334s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
              </rect>
            </g><g transform="rotate(60 50 50)">
              <rect fill="#585253" height="12" width="6" ry="6" rx="3" y="24" x="47">
                <animate repeatCount="indefinite" begin="-0.75s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
              </rect>
            </g><g transform="rotate(90 50 50)">
              <rect fill="#585253" height="12" width="6" ry="6" rx="3" y="24" x="47">
                <animate repeatCount="indefinite" begin="-0.6666666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
              </rect>
            </g><g transform="rotate(120 50 50)">
              <rect fill="#585253" height="12" width="6" ry="6" rx="3" y="24" x="47">
                <animate repeatCount="indefinite" begin="-0.5833333333333334s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
              </rect>
            </g><g transform="rotate(150 50 50)">
              <rect fill="#585253" height="12" width="6" ry="6" rx="3" y="24" x="47">
                <animate repeatCount="indefinite" begin="-0.5s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
              </rect>
            </g><g transform="rotate(180 50 50)">
              <rect fill="#585253" height="12" width="6" ry="6" rx="3" y="24" x="47">
                <animate repeatCount="indefinite" begin="-0.4166666666666667s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
              </rect>
            </g><g transform="rotate(210 50 50)">
              <rect fill="#585253" height="12" width="6" ry="6" rx="3" y="24" x="47">
                <animate repeatCount="indefinite" begin="-0.3333333333333333s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
              </rect>
            </g><g transform="rotate(240 50 50)">
              <rect fill="#585253" height="12" width="6" ry="6" rx="3" y="24" x="47">
                <animate repeatCount="indefinite" begin="-0.25s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
              </rect>
            </g><g transform="rotate(270 50 50)">
              <rect fill="#585253" height="12" width="6" ry="6" rx="3" y="24" x="47">
                <animate repeatCount="indefinite" begin="-0.16666666666666666s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
              </rect>
            </g><g transform="rotate(300 50 50)">
              <rect fill="#585253" height="12" width="6" ry="6" rx="3" y="24" x="47">
                <animate repeatCount="indefinite" begin="-0.08333333333333333s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
              </rect>
            </g><g transform="rotate(330 50 50)">
              <rect fill="#585253" height="12" width="6" ry="6" rx="3" y="24" x="47">
                <animate repeatCount="indefinite" begin="0s" dur="1s" keyTimes="0;1" values="1;0" attributeName="opacity"></animate>
              </rect>
            </g><g></g></g><!-- [ldio] generated by https://loading.io --></svg>`;

  // 添加必要的CSS样式
  GM_addStyle(`
      .ds-icon-button {
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          border-radius: 5px;
          transition: background-color 0.2s ease;
          border: 1px solid transparent;
          width: 30px;
          height: 30px;
      }
      .ds-icon-button:hover {
          background-color: rgba(0, 0, 0, 0.05);
      }
      .title-bar-button {
          margin-left: 10px;
      }
      .ds-share-dialog {
        border: 1px solid #e5e7eb;
        border-radius: 0.5rem;
        padding: 1rem;
        background: white;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
      }
      .ds-share-dialog p {
        margin-bottom: 1rem;
      }
      .ds-share-dialog button {
        cursor: pointer;
      }
  `);
  async function generateShareLink({ content, styles }) {
    const payload = {
      content,
      styles // 如果需要样式，请填入你想要的 css 字符串
    };
    const apiUrl = 'https://deepseek-share-api.1338994.xyz'; // 你的 API 地址
    // console.log("当前 API 地址:", apiUrl)
    const res = await fetch(`${apiUrl}/share`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.json(); // 返回 { id, shareLink }
  }
  class ShareDialog {
    constructor() {
      this.dialog = document.createElement('div');
      this.dialog.className = 'ds-share-dialog';
      this.dialog.innerHTML = `
        <p>分享链接已生成！</p>
        <button id="copy-btn">复制链接</button>
      `;

      this.copyBtn = this.dialog.querySelector('#copy-btn');
      this.copyBtn.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('copy-link'));
        this.close();
      });

      document.body.appendChild(this.dialog);
      this.dialog.style.display = 'none';
    }

    show() {
      this.dialog.style.display = 'block';
    }

    close() {
      this.dialog.style.display = 'none';
      this.dialog.remove();
    }

    addEventListener(event, callback) {
      this.dialog.addEventListener(event, callback);
    }

    dispatchEvent(event) {
      this.dialog.dispatchEvent(event);
    }
  }
  customElements.define("share-dialog", ShareDialog);
  // SharePageGenerator 类 (JavaScript版本)
  class SharePageGenerator {
      constructor() {
          this.containerSelector = '#root';
          this.excludedSelectors = [
              'div#root > div > div:nth-child(2) > div:nth-child(1)',
              'div#root > div > div:nth-child(2) > div:last-child > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2)',
              'div#root > div > div:nth-child(2) > div:last-child > div > div:nth-child(2) > div > div:nth-child(1) > div:last-child',
          ];
      }

      async generate() {
          const { content, styles } = this.prepareContent();
          return { content, styles };
      }

      prepareContent() {
          const container = document.querySelector(this.containerSelector);
          if (!container) throw new Error('内容容器未找到');

          return {
              content: this.processContent(container.cloneNode(true)),
              styles: this.getEffectiveStyles()
          };
      }

      processContent(node) {
          this.removeExcludedElements(node);
          this.resolveAssetPaths(node);
          this.removeInteractiveElements(node);
          this.addWatermark(node);
          return node.outerHTML;
      }

      resolveAssetPaths(node) {
          node.querySelectorAll('img').forEach(img => {
              img.src = this.normalizeUrl(img.src);
          });
      }

      normalizeUrl(url) {
          return url.startsWith('data:') ? url : new URL(url, location.href).href;
      }

      removeInteractiveElements(node) {
          node.querySelectorAll('button, .ds-icon-button, script, style').forEach(el => el.remove());
      }

      addWatermark(node) {
          const watermark = document.createElement('div');
          watermark.innerHTML = ``;
          node.appendChild(watermark);
      }

      getEffectiveStyles() {
          return Array.from(document.styleSheets)
              .filter(sheet => !sheet.href || sheet.href.startsWith(location.origin))
              .map(sheet => {
                  try {
                      return Array.from(sheet.cssRules)
                          .map(rule => rule.cssText)
                          .join('\n');
                  } catch (e) {
                      console.warn('样式表读取失败:', e);
                      return '';
                  }
              })
              .join('\n');
      }

      removeExcludedElements(node) {
          this.excludedSelectors.forEach(selector => {
              node.querySelectorAll(selector).forEach(el => {
                  el.remove();
              });
          });
      }
  }

  // 新增定位会话标题方法
  function findSessionTitleContainer() {
      const titleBars = Array.from(document.querySelectorAll('div#root > div > div:nth-child(2) > div:nth-child(2) > div > div > div'));
      return titleBars;
  }

  // 添加分享按钮
  function addShareButton(container, isTitleBar = false) {
      const shareBtn = document.createElement('div');
      shareBtn.className = `ds-icon-button share-button ${isTitleBar ? 'title-bar-button' : ''}`;

      shareBtn.innerHTML = `
          <div class="ds-icon" style="font-size: 20px; width: 20px; height: 20px;">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8C19.6569 8 21 6.65685 21 5C21 3.34315 19.6569 2 18 2C16.3431 2 15 3.34315 15 5C15 6.65685 16.3431 8 18 8Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M18 22C19.6569 22 21 20.6569 21 19C21 17.3431 19.6569 16 18 16C16.3431 16 15 17.3431 15 19C15 20.6569 16.3431 22 18 22Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M6 15C7.65685 15 9 13.6569 9 12C9 10.3431 7.65685 9 6 9C4.34315 9 3 10.3431 3 12C3 13.6569 4.34315 15 6 15Z" stroke="currentColor" stroke-width="2"/>
                  <path d="M15.5 6.5L8.5 10.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M8.5 13.5L15.5 17.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
          </div>
      `;

      shareBtn.tabIndex = 0;
      shareBtn.style.setProperty('--ds-icon-button-text-color', '#909090');

      shareBtn.addEventListener('click', async () => {
          const originalHTML = shareBtn.innerHTML;
          shareBtn.innerHTML = `
            <img src="data:image/svg+xml;utf8,${encodeURIComponent(loadingSVG)}"
                style="width: 20px; height: 20px;"
                alt="loading" />
          `;
          shareBtn.style.pointerEvents = 'none';

          try {
              const generator = new SharePageGenerator();
              const { content, styles } = await generator.generate();
              console.log('Generated Content:', content);
              console.log('Generated Styles:', styles);
              const { shareUrl } = await generateShareLink({ content, styles });
              const dialog = new ShareDialog();
              dialog.addEventListener('copy-link', () => {
                navigator.clipboard.writeText(shareUrl)
                  .then(() => {
                    alert('分享链接已复制到剪贴板');
                    console.log('分享链接已复制到剪贴板');
                  })
                  .catch(err => console.error('复制失败', err));
              });
              dialog.show();

          } catch (error) {
              console.error(error);
          } finally {
              shareBtn.innerHTML = originalHTML;
              shareBtn.style.pointerEvents = '';
          }
      });

      container.appendChild(shareBtn);
  }

  // 观察器逻辑
  const observer = new MutationObserver(mutations => {
      mutations.forEach(mut => {
          if (mut.addedNodes.length) {
              findSessionTitleContainer().forEach(container => {
                  if (
                      !container?.querySelector('.share-button') &&
                      container?.querySelector('div:nth-child(1) > div') &&
                      container.querySelector('div:nth-child(1) > div').textContent?.trim()
                  ) {
                      container && addShareButton(container, true);
                  }
              });
          }
      });
  });

  observer.observe(document.body, {
      childList: true,
      subtree: true
  });

  // 启动时添加分享按钮
  findSessionTitleContainer().forEach(container => {
      if (
          !container?.querySelector('.share-button') &&
          container?.querySelector('div:nth-child(1) > div') &&
          container.querySelector('div:nth-child(1) > div').textContent?.trim()
      ) {
          container && addShareButton(container, true);
      }
  });
})();