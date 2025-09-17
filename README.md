# Worker 线程演示项目

这个演示项目展示了 Node.js Worker Threads 和浏览器 Web Workers 的基本用法和区别。

## 项目结构

```
worker-demo/
├── node-worker/         # Node.js Worker Threads 示例
│   ├── main.js          # Node.js 主线程代码
│   └── worker.js        # Node.js 工作线程代码
├── public/              # 前端资源
│   ├── index.html       # 主页面
│   ├── styles.css       # 样式表
│   ├── main.js          # 前端主线程代码
│   └── worker.js        # Web Worker 代码
├── server.js            # Express 服务器
├── package.json         # 项目配置
└── README.md            # 说明文档
```

## 功能特点

### Node.js Worker Threads
- 在 Node.js 环境中运行多线程
- 主线程和工作线程之间的消息传递
- 适用于 CPU 密集型任务

### Web Workers
- 在浏览器环境中运行后台线程
- 不阻塞 UI 线程的长时间计算
- 主线程和工作线程之间的消息传递

## 如何运行

1. 安装依赖：
   ```
   npm install
   ```

2. 启动服务器：
   ```
   npm start
   ```

3. 在浏览器中访问：
   ```
   http://localhost:3000
   ```

## 演示说明

### Node.js Worker Threads 演示
点击"运行 Node.js Worker"按钮，服务器将创建一个 Worker 线程执行 CPU 密集型计算，并返回执行结果。

### Web Workers 演示
1. 点击"启动 Web Worker"按钮创建一个 Web Worker
2. 输入一个数字（建议 30-40 之间）
3. 点击"计算斐波那契数"按钮
4. 观察动画是否流畅（Web Worker 不会阻塞 UI 线程）
5. 可以点击"停止 Web Worker"按钮终止工作线程

## 两种 Worker 的主要区别

| 特性 | Node.js Worker Threads | Web Workers |
|------|------------------------|-------------|
| 运行环境 | Node.js 服务器端 | 浏览器客户端 |
| 数据共享 | 支持 SharedArrayBuffer | 支持 SharedArrayBuffer |
| 线程创建 | 较轻量级 | 较重量级 |
| 适用场景 | 服务器端 CPU 密集型任务 | 客户端长时间计算不阻塞 UI |
| 通信方式 | 消息传递 | 消息传递 |