module.exports = {
  apps: [
    {
      name: 'george-burger',
      script: 'npm',
      args: 'run dev:node',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}