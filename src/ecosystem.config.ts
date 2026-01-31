const config = {
  apps: [
    {
      name: "chess-backend",
      script: "main.js",
      cwd: "./server",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      error_file: "/var/log/chess/error.log",
      out_file: "/var/log/chess/out.log",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

export = config;
