module.exports = {
  apps: [
    {
      name: "express_server",
      watch: true,
      json: true,
      ignore_watch: ["node_modules", "\\.git", "*.log"],
      script: "./WNC_expressjs/index.js",
      error_file: "./WNC_expressjs/logs/error.log",
      out_file: "./WNC_expressjs/logs/out.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
  ],
};
