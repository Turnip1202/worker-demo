// 全局变量
let webWorker = null;

// DOM 元素
document.addEventListener('DOMContentLoaded', () => {
    // Node.js Worker 相关元素
    const runNodeWorkerBtn = document.getElementById('runNodeWorker');
    const runNodeNoWorkerBtn = document.getElementById('runNodeNoWorker');
    const nodeWorkerOutput = document.getElementById('nodeWorkerOutput');
    
    // Web Worker 相关元素
    const startWebWorkerBtn = document.getElementById('startWebWorker');
    const stopWebWorkerBtn = document.getElementById('stopWebWorker');
    const calculateFibonacciBtn = document.getElementById('calculateFibonacci');
    const numberInput = document.getElementById('numberInput');
    const webWorkerOutput = document.getElementById('webWorkerOutput');
    
    // 无 Worker 相关元素
    const calculateFibonacciNoWorkerBtn = document.getElementById('calculateFibonacciNoWorker');
    const numberInputNoWorker = document.getElementById('numberInputNoWorker');
    const noWorkerOutput = document.getElementById('noWorkerOutput');

    // Node.js Worker 演示
    runNodeWorkerBtn.addEventListener('click', async () => {
        nodeWorkerOutput.textContent = '正在使用 Node.js Worker 运行...\n';
        
        try {
            const startTime = performance.now();
            const response = await fetch('/run-node-worker');
            const data = await response.json();
            const endTime = performance.now();
            
            if (data.success) {
                nodeWorkerOutput.textContent = `使用 Worker 线程执行耗时任务：\n${data.output.join('\n')}\n\n总耗时: ${(endTime - startTime).toFixed(2)}ms`;
            } else {
                nodeWorkerOutput.textContent = `错误: ${data.error}`;
            }
        } catch (error) {
            nodeWorkerOutput.textContent = `请求错误: ${error.message}`;
        }
    });
    
    // Node.js 无 Worker 演示
    runNodeNoWorkerBtn.addEventListener('click', async () => {
        nodeWorkerOutput.textContent = '正在不使用 Worker 运行...\n';
        
        try {
            const startTime = performance.now();
            const response = await fetch('/run-node-no-worker');
            const data = await response.json();
            const endTime = performance.now();
            
            if (data.success) {
                nodeWorkerOutput.textContent = `不使用 Worker 执行耗时任务：\n${data.output.join('\n')}\n\n总耗时: ${(endTime - startTime).toFixed(2)}ms`;
            } else {
                nodeWorkerOutput.textContent = `错误: ${data.error}`;
            }
        } catch (error) {
            nodeWorkerOutput.textContent = `请求错误: ${error.message}`;
        }
    });

    // Web Worker 演示
    startWebWorkerBtn.addEventListener('click', () => {
        if (!webWorker) {
            // 创建 Web Worker
            webWorker = new Worker('worker.js');
            
            // 监听 Web Worker 消息
            webWorker.onmessage = function(e) {
                const message = e.data;
                
                if (message.type === 'log') {
                    appendToOutput(webWorkerOutput, message.data);
                } else if (message.type === 'result') {
                    appendToOutput(webWorkerOutput, `计算结果: ${message.data}`);
                    enableUI(true);
                }
            };
            
            // 监听 Web Worker 错误
            webWorker.onerror = function(error) {
                appendToOutput(webWorkerOutput, `错误: ${error.message}`);
                enableUI(true);
            };
            
            appendToOutput(webWorkerOutput, 'Web Worker 已启动');
            enableUI(true, true);
        }
    });

    stopWebWorkerBtn.addEventListener('click', () => {
        if (webWorker) {
            webWorker.terminate();
            webWorker = null;
            
            appendToOutput(webWorkerOutput, 'Web Worker 已停止');
            enableUI(true, false);
        }
    });

    calculateFibonacciBtn.addEventListener('click', () => {
        if (webWorker) {
            const n = parseInt(numberInput.value);
            
            if (isNaN(n) || n < 1) {
                appendToOutput(webWorkerOutput, '请输入有效的数字');
                return;
            }
            
            appendToOutput(webWorkerOutput, `计算斐波那契数(${n})...`);
            enableUI(false, true);
            
            // 发送消息给 Web Worker
            webWorker.postMessage({
                command: 'fibonacci',
                data: n
            });
        } else {
            appendToOutput(webWorkerOutput, '请先启动 Web Worker');
        }
    });
    
    // 无 Worker 计算斐波那契数
    calculateFibonacciNoWorkerBtn.addEventListener('click', () => {
        const n = parseInt(numberInputNoWorker.value);
        
        if (isNaN(n) || n < 1) {
            appendToOutput(noWorkerOutput, '请输入有效的数字');
            return;
        }
        
        appendToOutput(noWorkerOutput, `计算斐波那契数(${n})...`);
        calculateFibonacciNoWorkerBtn.disabled = true;
        numberInputNoWorker.disabled = true;
        
        // 记录开始时间
        const startTime = performance.now();
        
        // 注意：这里会阻塞UI线程
        setTimeout(() => {
            try {
                // 直接在主线程中计算
                const result = fibonacci(n);
                const endTime = performance.now();
                const duration = (endTime - startTime).toFixed(2);
                
                appendToOutput(noWorkerOutput, `计算完成，耗时: ${duration}ms`);
                appendToOutput(noWorkerOutput, `计算结果: ${result}`);
            } catch (error) {
                appendToOutput(noWorkerOutput, `计算出错: ${error.message}`);
            } finally {
                calculateFibonacciNoWorkerBtn.disabled = false;
                numberInputNoWorker.disabled = false;
            }
        }, 10); // 短暂延迟，让UI能够更新
    });

    // 辅助函数
    function appendToOutput(outputElement, message) {
        const timestamp = new Date().toLocaleTimeString();
        outputElement.textContent += `[${timestamp}] ${message}\n`;
        outputElement.scrollTop = outputElement.scrollHeight;
    }

    function enableUI(enabled, workerActive = false) {
        calculateFibonacciBtn.disabled = !enabled || !workerActive;
        startWebWorkerBtn.disabled = workerActive;
        stopWebWorkerBtn.disabled = !workerActive;
        numberInput.disabled = !enabled;
    }
    
    // 计算斐波那契数列（递归方式，故意使用低效算法来展示CPU密集型任务）
    function fibonacci(n) {
        if (n <= 1) return n;
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
});