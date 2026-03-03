const { spawn } = require('child_process');
const path = require('path');

class AIProctorBridge {
    constructor() {
        this.pythonProcess = null;
        this.isReady = false;
        this.isBusy = false;
        this.callbacks = new Set();
    }

    start() {
        const scriptPath = path.join(__dirname, 'proctor_worker.py');
        console.log(`Starting AI Bridge: python ${scriptPath}`);

        this.pythonProcess = spawn('python', [scriptPath], {
            cwd: path.dirname(__dirname) // Run from root to resolve models/
        });

        this.pythonProcess.stdout.on('data', (data) => {
            const lines = data.toString().split('\n');
            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const result = JSON.parse(line);
                    if (result.type === 'ready') {
                        this.isReady = true;
                        console.log('AI Bridge is Ready');
                    } else if (result.type === 'result') {
                        this.isBusy = false;
                        this.notifyCallbacks(result);
                    } else if (result.type === 'error') {
                        console.error('AI Bridge Internal Error:', result.message);
                    }
                } catch (e) {
                    // console.log('AI Bridge Raw Log:', line);
                }
            }
        });

        this.pythonProcess.stderr.on('data', (data) => {
            console.error(`AI Bridge Stderr: ${data}`);
        });

        this.pythonProcess.on('close', (code) => {
            console.log(`AI Bridge exited with code ${code}`);
            this.isReady = false;
            this.isBusy = false;
        });
    }

    analyze(frameBase64) {
        if (!this.isReady || !this.pythonProcess || this.isBusy) {
            return;
        }
        this.isBusy = true;
        const payload = JSON.stringify({ type: 'image', image: frameBase64 }) + '\n';
        this.pythonProcess.stdin.write(payload);
    }

    reset() {
        if (this.pythonProcess) {
            this.pythonProcess.stdin.write(JSON.stringify({ type: 'reset' }) + '\n');
        }
    }

    onResult(callback) {
        this.callbacks.add(callback);
    }

    notifyCallbacks(result) {
        this.callbacks.forEach(cb => cb(result));
    }

    stop() {
        if (this.pythonProcess) {
            this.pythonProcess.kill();
        }
    }
}

module.exports = new AIProctorBridge();
