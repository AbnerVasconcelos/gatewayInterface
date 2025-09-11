module.exports = {
  apps: [{
    name: 'minha-app-react',
    script: 'npx',
    args: ['serve', '-s', 'build', '-l', '3000'],
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}