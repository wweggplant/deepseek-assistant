/// <reference types="vite/client" />

declare namespace chrome {
  namespace runtime {
    interface MessageSender {
      tab?: chrome.tabs.Tab
    }
    
    interface LastError {
      message?: string
    }
  }
}

interface ChromeMessage<T = any> {
  type: string
  payload?: T
} 