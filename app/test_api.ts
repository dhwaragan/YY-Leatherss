import http from 'http';
http.get('http://127.0.0.1:3000/api/products', (res) => {
  console.log('Status Code:', res.statusCode);
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => console.log('Data:', d.substring(0, 100)));
}).on('error', console.error);
