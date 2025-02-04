# DeepSeek Assistant

[简体中文](README.md) | [English]

DeepSeek Assistant is a browser extension designed to enhance the experience of the official DeepSeek web version. It primarily provides session sharing functionality, helping users quickly generate and share conversation links, making it easier to save and transfer conversation content.

## Preview

![Click Share Button](https://github.com/user-attachments/assets/01b02ebc-774e-4405-963f-884fb71f8f04)
 <div align="center">
  Click Share Button
 </div>

![Share link generated successfully, click to copy. You can send the link to others](https://github.com/user-attachments/assets/83ecf9cc-3121-4b8d-b8b3-60837d6c943f)

![Share Page Effect](https://github.com/user-attachments/assets/7d797a82-31d5-444a-adaa-22c5c39811cc)
 <div align="center">
  Share Page Effect
 </div>

## Features

- **Share Conversations**  
  Automatically adds a [Share] button on the DeepSeek chat page. Clicking it generates a share link and displays a share dialog, allowing users to easily share conversation content.

- **Custom Web Components**  
  Uses Shadow DOM encapsulated custom elements to achieve complete isolation from page styles, ensuring the appearance and functionality of the share dialog are not affected by the original page.

- **Modern Frontend Technology Stack**  
  Built with Vite and TypeScript, leveraging the latest development technologies to provide an efficient development experience and excellent user experience.

## Installation and Usage

## Latest Version Download
Click the link below to download the latest version of the extension:
[Latest Version Download](https://github.com/wweggplant/deepseek-assistant/releases/latest), select deepseek-assistant.zip under Assets.

### Installation
This extension currently needs to be manually loaded (not installed via the Chrome Web Store). For details, please refer to: [Chrome Extension Manual Installation Guide](https://docs.authing.cn/v2/guides/asa/chrome-manual-install.html).

### Local Development and Debugging

1. **Clone Repository**
   ```bash
   git clone https://github.com/wweggplant/deepseek-assistant.git
   ```

2. **Install Dependencies and Run Development**
   Enter the root directory, then execute:
   ```bash
   pnpm install
   # Development 
   cd apps/browser-extension
   pnpm run dev
   ```

3. **Build Extension**
   Use the following command to build the extension:
   ```bash
   pnpm run build
   ```
   After building, the files will be output to the `dist` directory.

4. **Load Extension**
   - Open Chrome browser, visit `chrome://extensions` page;
   - Enable Developer Mode;
   - Click "Load unpacked" and select the `apps/browser-extension/dist` folder.

## Contribution

Welcome to submit Issues or Pull Requests to improve the project. If you have any suggestions or encounter any problems, please provide feedback on GitHub. We look forward to your participation.

## License

This project is open source under the [MIT License](LICENSE). All code and resources are open-sourced under this agreement.

---

DeepSeek Assistant is committed to enhancing the user experience of the DeepSeek web version, making session sharing faster and more efficient. We hope you enjoy and use this project! 