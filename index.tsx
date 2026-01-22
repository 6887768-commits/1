
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// 扩展 Window 接口以处理 PWA 事件
declare global {
  interface Window {
    deferredPrompt: any;
  }
}

// 注册 PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW Registered!', reg))
      .catch(err => console.log('SW Registration failed:', err));
  });
}

// 监听安装提示事件
window.addEventListener('beforeinstallprompt', (e) => {
  // 阻止 Chrome 67 及更早版本自动显示提示
  e.preventDefault();
  // 存放事件以备后用
  window.deferredPrompt = e;
  // 触发一个自定义事件告知 Layout 组件显示安装按钮
  window.dispatchEvent(new Event('pwa-install-available'));
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
