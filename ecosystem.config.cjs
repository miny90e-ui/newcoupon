// PM2 process file for the Hostinger VPS. Start with: pm2 start ecosystem.config.cjs
module.exports = {
  apps: [
    {
      name: "new-coupon",
      cwd: __dirname,
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000 -H 127.0.0.1",
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "700M",
      env: { NODE_ENV: "production" },
    },
  ],
};
