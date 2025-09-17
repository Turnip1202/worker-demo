const { parentPort, workerData } = require('worker_threads');

console.log(`工作线程: 启动，初始值为 ${workerData.initialValue}`);

// 接收来自主线程的消息
parentPort.on('message', (message) => {
  console.log(`工作线程: 收到主线程消息 - ${message}`);
  
  // 模拟耗时计算
  console.log('工作线程: 开始执行耗时计算...');
  
  // 模拟CPU密集型操作
  let result = workerData.initialValue;
  for (let i = 0; i < 1000000000; i++) {
    result += Math.sqrt(i);
  }
  
  // 将结果发送回主线程
  parentPort.postMessage(`计算完成，结果: ${result}`);
});