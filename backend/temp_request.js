const http = require('http');
const data = JSON.stringify({
  name: 'directtest2',
  email: 'directtest2@example.com',
  password: 'Password123!',
  role: 'Member'
});
const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data)
  }
};
const req = http.request(options, (res) => {
  console.log('STATUS', res.statusCode);
  let body = '';
  res.on('data', (chunk) => (body += chunk));
  res.on('end', () => {
    console.log(body);
    process.exit(0);
  });
});
req.on('error', (e) => {
  console.error('ERROR', e);
  process.exit(1);
});
req.write(data);
req.end();
