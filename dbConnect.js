const mongoose = require('mongoose');

const mongoConnectString = process.env.MONGO_CONNECT;
if (!mongoConnectString) {
  console.log('Please set up all of your enviroment variables');
  console.log('Process exited with code: 1');
  process.exit(1);
}

function connect() {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  mongoose.set('useUnifiedTopology', true);
  mongoose.connect(mongoConnectString);
  const mongoDB = mongoose.connection;

  mongoDB.on('error', (err) => {
    console.error(`MongoDB error: \n${err}`);
    throw err;
  });
  if (mongoDB.readyState === 2) {
    mongoDB.once('connected', () => {
      console.log('Connected to MongoDB!');
      return true;
    });
  } else {
    throw (new Error('Not connected to MongoDB'));
  }
}

function closeConnection() {
  const mongoDB = mongoose.connection;
  if (mongoDB.readyState === 1) {
    mongoDB.close();

    mongoDB.on('error', (err) => {
      console.error(`MongoDB error: ${err}`);
      throw err;
    });
    if (mongoDB.readyState === 3 || mongoDB.readyState === 0) {
      mongoDB.once('disconnected', () => {
        console.log('\n' + 'Disconnected from MongoDB!');
        return true;
      });
    } else {
      throw (new Error('Unable to disconnect from MongoDB'));
    }
  }
}

function getConnectionStatus() {
  return mongoose.connection.readyState;
}

module.exports = {
  connect,
  closeConnection,
  connectionStatus: getConnectionStatus,
};
