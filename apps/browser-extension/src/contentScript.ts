import SharePageGenerator from './sharePageGenerator';

// 使用组件
// 新增定位会话标题方法
function findSessionTitleContainer() {
  // 查找包含"New Chat"文本的标题容器
  const titleBars = Array.from(document.querySelectorAll('div#root > div > div:nth-child(2) > div:nth-child(2) > div > div > div'))

  // 查找最近的按钮容器
  return titleBars
}

// 修改观察器逻辑
const observer = new MutationObserver(mutations => {
  mutations.forEach(mut => {
    if (mut.addedNodes.length) {
      // 在标题栏添加按钮
      findSessionTitleContainer().forEach(container => {
        if (
          !container?.querySelector('.share-button') &&
          container?.querySelector('div:nth-child(1) > div') &&
          container.querySelector('div:nth-child(1) > div')!.textContent?.trim()
        ) {
          container && addShareButton(container, true); // 新增标题栏样式参数
        }
      });
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 修改后的添加按钮函数
function addShareButton(container: Element, isTitleBar = false) {
  const shareBtn = document.createElement('div');
  shareBtn.className = `ds-icon-button share-button ${isTitleBar ? 'title-bar-button' : ''}`;

  // 设定初始内容（图标）
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

  // 点击事件：添加 loading 状态（使用 GIF）
  shareBtn.addEventListener('click', async () => {
    // 保存原始内容以便恢复
    const originalHTML = shareBtn.innerHTML;
    
    // 设置 loading 状态，使用扩展内的 loading.gif 文件
    shareBtn.innerHTML = `
      <img src="${chrome.runtime.getURL('assets/loading.svg')}" 
           style="width: 20px; height: 20px;" 
           alt="loading" />
    `;
    // 禁用按钮防止重复点击
    shareBtn.style.pointerEvents = 'none';

    try {
      // 生成分享链接过程（可能比较耗时）
      const generator = new SharePageGenerator();
      const { content, styles } = await generator.generate();
      const { shareUrl } = await generateShareLink({ content, styles });
      const dialog = document.createElement('share-dialog');
      dialog.addEventListener('copy-link', () => {
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            alert('分享链接已复制到剪贴板');
            console.log('分享链接已复制到剪贴板');
          })
          .catch(err => console.error('复制失败', err));
      });
      document.body.appendChild(dialog);
      dialog.dispatchEvent(new CustomEvent('trigger-show'));
    } catch (error) {
      console.error(error);
    } finally {
      // 恢复原始状态，让按钮可以再次点击
      shareBtn.innerHTML = originalHTML;
      shareBtn.style.pointerEvents = '';
    }
  });

  container.appendChild(shareBtn);
}
async function generateShareLink({ content, styles }: { content: string, styles: string }): Promise<{ shareUrl: string; expiryDays: number }> {
  const payload = {
    content,
    styles // 如果需要样式，请填入你想要的 css 字符串
  };
  const apiUrl = import.meta.env.VITE_API_API_BASE
  // console.log("当前 API 地址:", apiUrl)
  const res = await fetch(`${apiUrl}/share`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return res.json(); // 返回 { id, shareLink }
}

// 动态注入Web Components定义
function injectWebComponent() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('components/ShareDialog.js');
  // script.onload = () => {
  //   console.log('ShareDialog组件已加载');
  // };
  document.documentElement.appendChild(script);
}

// 启动注入流程
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectWebComponent);
} else {
  injectWebComponent();
}

// 类型断言确保访问
interface ShareDialogInterface extends HTMLElement {
  show: () => void;
  close: () => void;
}


