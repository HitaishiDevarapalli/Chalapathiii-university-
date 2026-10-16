module.exports = {
  apps: [
    {
      name: "chalapathi-api",
      cwd: __dirname,
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};
