module.exports = {
  apps: [
    {
      name: "chalapathi-api",
      cwd: __dirname,
      script: "start.cjs",
      env: {
        NODE_ENV: "production",
        PORT: 5004
      }
    }
  ]
};
