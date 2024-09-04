import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div>
      <span>test</span>
      <App />
    </div>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// 获取根节点的 Fiber 对象
// const rootFiber = document.getElementById('root')._reactRootContainer._internalRoot.current;
setTimeout(() => {
  console.log(root); // 打印 Fiber 树的根节点
}, 1000);