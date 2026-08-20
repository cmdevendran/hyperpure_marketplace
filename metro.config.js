const { getDefaultConfig } = require('expo/metro-config');
const http = require('http');

const config = getDefaultConfig(__dirname);

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Catch any front-end fetch request targeted at /api
      if (req.url.startsWith('/api')) {
        
        // Define your backend container target details
        const proxyOptions = {
          hostname: 'your-backend-api-service', // Target container name or localhost
          port: 5000,                          // Target backend port
          path: req.url,
          method: req.method,
          headers: req.headers
        };

        // Create a native proxy request pipe
        const proxyReq = http.request(proxyOptions, (proxyRes) => {
          res.writeHead(proxyRes.statusCode, proxyRes.headers);
          proxyRes.pipe(res, { end: true });
        });

        proxyReq.on('error', (err) => {
          console.error('Proxy Error:', err);
          res.writeHead(502);
          res.end('Bad Gateway via Metro Proxy Layer');
        });

        req.pipe(proxyReq, { end: true });
        return;
      }
      
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
