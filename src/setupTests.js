const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // This will match any requests that start with "/api"
    createProxyMiddleware({
      target: 'http://localhost:5000', // Your backend's URL
      changeOrigin: true,
    })
  );
};
