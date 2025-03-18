import  { exec }from'child_process';

const PORT = 3000;

if (process.platform === 'win32') {
    exec(`netstat -ano | findstr :${PORT}`, (error, stdout) => {
        if (stdout) {
            const pid = stdout.split(' ').filter(Boolean).pop();
            exec(`taskkill /PID ${pid} /F`);
        }
    });
} else {
    exec(`lsof -i :${PORT} | grep LISTEN | awk '{print $2}' | xargs kill -9`);
} 