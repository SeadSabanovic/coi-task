export default {
  server: {
    port: 5173,
    open: true,
  },
  plugins: [
    {
      name: "handle-paths",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Handle root path
          if (req.url === "/") {
            req.url = "/pages/index.html";
            return next();
          }

          // Remove .html extension if present
          if (req.url.endsWith(".html")) {
            const cleanUrl = req.url.replace(".html", "");
            res.writeHead(301, { Location: cleanUrl });
            res.end();
            return;
          }

          // Handle /taskX routes
          const taskMatch = req.url.match(/^\/task(\d+)$/);
          if (taskMatch) {
            req.url = `/pages/task${taskMatch[1]}.html`;
            return next();
          }

          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": "/src",
      "@styles": "/styles",
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: "/pages/index.html",
        task1: "/pages/task1.html",
        task2: "/pages/task2.html",
        task3: "/pages/task3.html",
      },
    },
  },
};
