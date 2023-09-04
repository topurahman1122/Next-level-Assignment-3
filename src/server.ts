import mongoose from 'mongoose';
import app from './app';
import config from './config';
import { Server } from 'http';
import { errorLogger, logger } from './shared/logger';

//Log UncaughtException
process.on('uncaughtException', error => {
  errorLogger.error(`UncaughtException Detected!`, error);
  process.exit(1);
});

let server: Server;

const bootstrap = async () => {
  try {
    await mongoose.connect(config.database_url as string);
    logger.info('Database Connection Established');

    server = app.listen(config.port, () => {
      logger.info(`Server is listening on port: ${config.port}`);
    });
  } catch (error) {
    errorLogger.error(error);
  }
};

//Log UnhandledRejection
process.on('unhandledRejection', error => {
  if (server) {
    server.close(() => {
      errorLogger.error(`UnhandledRejection Detected!`, error);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

//Log SIGTERM
process.on('SIGTERM', () => {
  logger.info('SIGTERM is received');
  server.close(error => {
    errorLogger.error(`Error while closing server`, error);
  });
  mongoose.connection.close();
  process.exit(1);
});

//Start Server
bootstrap().catch(error => {
  errorLogger.error(`Error while starting server`, error);
  process.exit(1);
});
