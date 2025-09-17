const { Worker } = require('worker_threads');

console.log('主线程: 启动');

// 创建工作线程
const worker = new Worker(`${__dirname}/worker.js`, {
  workerData: { initialValue: 5 }
});

// 监听工作线程的消息
worker.on('message', (result) => {
  console.log(`主线程: 收到工作线程的结果 - ${result}`);
});

// 监听工作线程的错误
worker.on('error', (error) => {
  console.error(`主线程: 工作线程发生错误 - ${error}`);
});

// 监听工作线程的退出
worker.on('exit', (code) => {
  if (code !== 0) {
    console.error(`主线程: 工作线程异常退出，退出码: ${code}`);
  } else {
    console.log('主线程: 工作线程正常退出');
  }
});

// 向工作线程发送消息
worker.postMessage('开始计算');

console.log('主线程: 继续执行其他任务，不会被阻塞');

// 模拟主线程的其他工作
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(`主线程: 执行任务 ${i + 1}`);
  }, i * 500);
}