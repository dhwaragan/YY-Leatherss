import http from 'http';
const urls = ['/api/products', '/api/offers', '/api/content-blocks', '/api/orders', '/api/preorders', '/api/buybacks'];
urls.forEach(url => {
  http.get('http://127.0.0.1:3000' + url, (res) => {
    console.log(url, 'Status Code:', res.statusCode);
  }).on('error', console.error);
});
