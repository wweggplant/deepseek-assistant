# DeepSeek助手

DeepSeek助手是一款用于增强 DeepSeek 官方网页版体验的浏览器扩展，主要提供会话分享功能，帮助用户快速生成并分享当前对话链接，从而便于保存和传递对话内容。

## 功能特性

- **分享会话**  
  在 DeepSeek 聊天页面自动添加【分享】按钮，点击后生成分享链接，并展示分享对话框，让用户轻松共享会话内容。

- **自定义 Web 组件**  
  采用 Shadow DOM 封装的自定义元素，实现与页面样式的完全隔离，保证分享对话框的外观与功能不受原页面干扰。

- **现代前端技术栈**  
  基于 Vite、TypeScript 构建，利用最新开发技术提供高效开发体验和良好用户体验。

## 安装与使用

### 在线安装
该扩展目前需要手动加载（非 Chrome 网上应用店安装）。详情请参照：[Chrome 扩展手动安装指南](https://docs.authing.cn/v2/guides/asa/chrome-manual-install.html)。

### 本地开发与调试

1. **克隆仓库**
   ```bash
   git clone https://github.com/wweggplant/deepseek-assistant.git
   ```

2. **安装依赖和开发运行**
   进入根目录，然后执行：
   ```bash
   pnpm install
   # 开发 
   cd apps/browser-extension
   pnpm run dev
   ```

3. **构建扩展**
   使用以下命令构建扩展：
   ```bash
   pnpm run build
   ```
   构建后，文件将输出到 `dist` 目录下。

4. **加载扩展**
   - 打开 Chrome 浏览器，访问 `chrome://extensions` 页面；
   - 开启开发者模式；
   - 点击"加载已解压的扩展程序"，选择 `apps/browser-extension/dist` 文件夹即可。

## 贡献

欢迎提交 Issues 或 Pull Requests 来改进项目。如果你有任何建议或遇到问题，请在 GitHub 上进行反馈，我们期待你的参与。

## 许可证

该项目采用 [MIT License](LICENSE) 开源许可，所有代码和资源均按照该协议开源。

---

DeepSeek助手致力于提升 DeepSeek 网页端的用户体验，让分享会话变得更加快捷与高效。希望你能喜欢并使用本项目！
