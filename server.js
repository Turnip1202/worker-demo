const express = require('express');
const path = require('path');
const { Worker } = require('worker_threads');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;

// 提供静态文件
app.use(express.static(path.join(__dirname, 'public')));

// 主页路由
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Node.js Worker Threads API
app.get('/run-node-worker', (req, res) => {
  const output = [];
  
  // 创建一个 Worker 线程
  const worker = new Worker(path.join(__dirname, 'node-worker', 'worker.js'), {
    workerData: { initialValue: 5 }
  });
  
  // 收集输出
  worker.on('message', (result) => {
    output.push(`主线程: 收到工作线程的结果 - ${result}`);
  });
  
  worker.on('error', (error) => {
    output.push(`主线程: 工作线程发生错误 - ${error}`);
  });
  
  worker.on('exit', (code) => {
    if (code !== 0) {
      output.push(`主线程: 工作线程异常退出，退出码: ${code}`);
    } else {
      output.push('主线程: 工作线程正常退出');
    }
    
    // 返回收集到的输出
    res.json({ success: true, output });
  });
  
  // 向工作线程发送消息
  output.push('主线程: 启动');
  output.push('主线程: 向工作线程发送消息');
  worker.postMessage('开始计算');
  output.push('主线程: 继续执行其他任务，不会被阻塞');
});

// 不使用 Worker 的 API
app.get('/run-node-no-worker', (req, res) => {
  const output = [];
  
  output.push('主线程: 开始执行耗时计算...');
  
  // 记录开始时间
  const startTime = process.hrtime();
  
  // 直接在主线程中执行耗时计算
  let result = 5; // 初始值
  for (let i = 0; i < 1000000000; i++) {
    result += Math.sqrt(i);
  }
  
  // 计算耗时
  const endTime = process.hrtime(startTime);
  const duration = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);
  
  output.push(`主线程: 计算完成，耗时: ${duration}ms`);
  output.push(`主线程: 计算结果: ${result}`);
  output.push('主线程: 注意 - 在计算过程中，服务器无法处理其他请求！');
  
  // 返回结果
  res.json({ success: true, output });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});