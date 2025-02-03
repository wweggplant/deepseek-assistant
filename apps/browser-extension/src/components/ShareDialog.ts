// 组件定义文件（不直接注册）
export class ShareDialog extends HTMLElement {
  static readonly tagName = 'share-dialog';

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        .dialog {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          background: white;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        }
      </style>
      <dialog class="dialog">
        <p>分享链接已生成！</p>
        <button id="copy-btn">复制链接</button>
      </dialog>
    `;

    shadow.querySelector('#copy-btn')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('copy-link'));
      this.close();
    });
    this.addEventListener('trigger-show', () => {
      const dialog = this.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
      dialog.showModal();
    });
  }

  show() {
    const dialog = this.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
    dialog.showModal();
  }

  close() {
    const dialog = this.shadowRoot?.querySelector('dialog') as HTMLDialogElement;
    dialog.close();
  }
}
customElements.define("share-dialog", ShareDialog);
