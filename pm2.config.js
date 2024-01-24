module.exports = {
  name: 'atlas-app', // Name of your application
  script: 'main.ts', // Entry point of your application
  interpreter: '~/.bun/bin/bun', // Path to the Bun interpreter
  exec_mode: 'cluster',
  instances: 1,
}
