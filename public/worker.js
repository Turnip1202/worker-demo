// Web Worker 线程

// 发送日志消息到主线程
function log(message) {
  self.postMessage({
    type: 'log',
    data: message
  });
}

// 发送结果到主线程
function sendResult(result) {
  self.postMessage({
    type: 'result',
    data: result
  });
}

// 计算斐波那契数列（递归方式，故意使用低效算法来展示CPU密集型任务）
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 监听来自主线程的消息
self.onmessage = function(e) {
  const message = e.data;
  
  log(`收到主线程消息: ${JSON.stringify(message)}`);
  
  if (message.command === 'fibonacci') {
    const n = message.data;
    
    log(`开始计算斐波那契数(${n})...`);
    
    // 记录开始时间
    const startTime = performance.now();
    
    // 执行计算
    try {
      const result = fibonacci(n);
      const endTime = performance.now();
      const duration = (endTime - startTime).toFixed(2);
      
      log(`计算完成，耗时: ${duration}ms`);
      sendResult(result);
    } catch (error) {
      log(`计算出错: ${error.message}`);
    }
  } else {
    log(`未知命令: ${message.command}`);
  }
};