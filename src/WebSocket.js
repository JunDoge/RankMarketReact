const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = (app) => {
    app.use(
        "/ws",
        createProxyMiddleware({
            target: "http://1.251.115.6:1521:8089",
            changeOrigin: true,
        })
    );
};