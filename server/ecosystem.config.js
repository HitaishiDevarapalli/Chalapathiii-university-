module.exports = {
  apps: [
    {
      name: "chalapathi-api",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 5000
      }
    }
  ]
};
