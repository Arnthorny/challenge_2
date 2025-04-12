const { storage } = require('./models');
const app = require('./app');

let server;

async function start() {
  await storage.reload();

  const port = process.env.PORT || 3000;
  const host = process.env.HOST || 'localhost';

  server = app.listen(port, host, () => {
    /* eslint-disable no-console */
    console.log(`Server is running on port ${port} on ${host}`);
  });
}
start();

const exitHandler = async () => {
  await storage.close();
  if (server) server.close(() => console.log('Server closed'));
};

const unexpectedErrorHandler = (error) => {
  console.error(error);
  exitHandler();
  process.exit(1);
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', exitHandler);
