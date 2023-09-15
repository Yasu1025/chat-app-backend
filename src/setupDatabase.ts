import Logger from 'bunyan';
import mongoose from 'mongoose';
import { config } from '@root/config';

const log: Logger = config.createLogger('Setup DB');

export default () => {
  const connect = () => {
    log.info('connecting to DB....');
    mongoose
      .connect(`${config.DATABASE_URL}`)
      .then(() => {
        log.info('succesefully connected to DB');
      })
      .catch(error => {
        log.error('ERROR: Connected to DB', error);
        return process.exit(1);
      });
  };
  connect();

  mongoose.connection.on('Disconnected', connect);
};
