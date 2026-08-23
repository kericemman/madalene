module.exports = {
  apps: [
    {
      name: "earned-credibility-api",
      cwd: "./backend",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};
