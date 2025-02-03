class SharePageGenerator {
  private containerSelector = '#root';
  private excludedSelectors = [
    'div#root > div > div:nth-child(2) > div:nth-child(1)',                      // 导航侧边栏
    'div#root > div > div:nth-child(2) > div:last-child > div > div:nth-child(2) > div > div:nth-child(1) > div:nth-child(2)',         // 新建会话按钮
    'div#root > div > div:nth-child(2) > div:last-child > div > div:nth-child(2) > div > div:nth-child(1) > div:last-child',         // 输入框容器
  ];

  async generate(): Promise<{ content: string; styles: string }> {
    const { content, styles } = this.prepareContent();
    return { content, styles };
  }

  private prepareContent() {
    const container = document.querySelector(this.containerSelector);
    if (!container) throw new Error('内容容器未找到');

    return {
      content: this.processContent(container.cloneNode(true) as HTMLElement),
      styles: this.getEffectiveStyles()
    };
  }

  private processContent(node: HTMLElement): string {
    // 清理非会话内容
    this.removeExcludedElements(node);
    
    // 处理资源路径
    this.resolveAssetPaths(node);
    
    // 清理交互元素
    this.removeInteractiveElements(node);
    
    // 添加水印
    this.addWatermark(node);
    
    return node.outerHTML;
  }

  private resolveAssetPaths(node: HTMLElement) {
    node.querySelectorAll('img').forEach(img => {
      img.src = this.normalizeUrl(img.src);
    });
  }

  private normalizeUrl(url: string): string {
    return url.startsWith('data:') ? url : new URL(url, location.href).href;
  }

  private removeInteractiveElements(node: HTMLElement) {
    node.querySelectorAll('button, .ds-icon-button, script, style').forEach(el => el.remove());
  }

  private addWatermark(node: HTMLElement) {
    const watermark = document.createElement('div');
    watermark.innerHTML = ``;
    node.appendChild(watermark);
  }

  private getEffectiveStyles(): string {
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

  private removeExcludedElements(node: HTMLElement) {
    this.excludedSelectors.forEach(selector => {
      node.querySelectorAll(selector).forEach(el => {
        el.remove()
        // console.log(el, 'el')
      });
    });
    // 额外清理可能存在的空白区域
    // node.querySelectorAll('div').forEach(div => {
    //   if (div.clientHeight < 50 && div.textContent?.trim() === '') {
    //     div.remove();
    //   }
    // });
  }
}

export default SharePageGenerator; 