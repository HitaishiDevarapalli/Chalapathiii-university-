// Explicit process entry point: importing the Express app alone does not open a port.
const app = require('./dist/index.js').default;
const port = Number(process.env.PORT || 5000);
if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT must be a valid TCP port');
const server = app.listen(port, process.env.HOST || '0.0.0.0', () => {
  console.log('Chalapathi API listening on port ' + server.address().port);
});
server.on('error', error => {
  console.error('Chalapathi API failed to listen: ' + (error.code || 'listener_error'));
  process.exitCode = 1;
});
module.exports = server;
