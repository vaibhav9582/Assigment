const http = require('http');
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Zjg4NjdhZmIyMzIwNTM1ZDRmMDhjOCIsImlhdCI6MTc3Nzg5NTAzNCwiZXhwIjoxNzgwNDg3MDM0fQ.GtvnPXjT43AZzJaCFXdEEmRDg5ne-J0budAL5C5K7Ts';
const opts = {
  hostname: 'localhost',
  port: 5000,
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`,
  },
};

function request(path) {
  return new Promise((resolve, reject) => {
    const req = http.request({ ...opts, path }, (res) => {
      let body = '';
      res.on('data', (d) => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  try {
    console.log('stats', await request('/api/dashboard/stats'));
    console.log('tasks', await request('/api/tasks'));
  } catch (err) {
    console.error(err);
  }
})();
