const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting backend and frontend...\n');

// Start backend first
const backendProcess = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname
});

// Wait a moment for backend to start, then start frontend
setTimeout(() => {
  const frontendProcess = spawn('npm', ['run', 'start:frontend'], {
    stdio: 'inherit',
    cwd: __dirname,
    env: { ...process.env, PORT: '3003' }
  });

  // Handle termination
  process.on('SIGINT', () => {
    console.log('\n\n⏹️  Shutting down...');
    backendProcess.kill();
    frontendProcess.kill();
    process.exit(0);
  });
}, 1000);

// Handle backend errors
backendProcess.on('error', (err) => {
  console.error('❌ Backend error:', err);
});

backendProcess.on('exit', (code) => {
  console.log(`Backend exited with code ${code}`);
});
