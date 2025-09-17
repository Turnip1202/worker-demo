const { parentPort, workerData } = require('worker_threads');

// 发送消息到主线程的辅助函数
function sendMessage(message) {
  parentPort.postMessage({ type: 'log', message });
}

// 发送结果到主线程的辅助函数
function sendResult(message) {
  parentPort.postMessage({ type: 'result', message });
}

sendMessage(`工作线程: 启动，初始值为 ${workerData.initialValue}`);

// 接收来自主线程的消息
parentPort.on('message', (message) => {
  sendMessage(`工作线程: 收到主线程消息 - ${message}`);
  
  // 模拟耗时计算
  sendMessage('工作线程: 开始执行耗时计算...');
  
  // 模拟CPU密集型操作
  let result = workerData.initialValue;
  
  // 减少计算量以平衡演示效果和响应性 (遵循新的内存要求：500K iterations)
  const iterations = 500000; // 50万次迭代
  sendMessage(`工作线程: 开始计算 ${iterations} 次迭代...`);
  
  const startTime = process.hrtime();
  
  for (let i = 0; i < iterations; i++) {
    result += Math.sqrt(i);
    // 每5万次迭代输出一次进度
    if (i % 50000 === 0 && i > 0) {
      const progress = ((i / iterations) * 100).toFixed(1);
      sendMessage(`工作线程: 进度 ${progress}%`);
    }
  }
  
  const endTime = process.hrtime(startTime);
  const duration = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);
  
  sendMessage(`工作线程: 计算完成，耗时: ${duration}ms`);
  
  // 将结果发送回主线程
  sendResult(`计算完成，结果: ${result.toFixed(2)}, 耗时: ${duration}ms`);
  
  // 主动退出工作线程
  process.exit(0);
});