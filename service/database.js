const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('outfishn');
const usersCollection = db.collection('users');
const scoreCollection = db.collection('catches');

// This will asynchronously test the connection and exit the process if it fails
(async function testConnection() {
    try {
      await db.command({ ping: 1 });
      console.log(`Connect to database`);
    } catch (ex) {
      console.log(`Unable to connect to database with ${url} because ${ex.message}`);
      process.exit(1);
    }
  })();

  function getUser(email) {
    return usersCollection.findOne({ email: email });
  }
  
  function getUserByToken(token) {
    return usersCollection.findOne({ token: token });
  }

  function getUserByUsername(username) {
    return usersCollection.findOne({ username: username });
  }

  async function addUser(user) {
    await usersCollection.insertOne(user);
  }

  async function removeUserToken(email) {
    await userCollection.updateOne({ email: email }, { $unset: { token: "" } });
  }

  async function updateUser(user) {
    await usersCollection.updateOne({ email: user.email }, { $set: user });
  }

  async function addCatch(fish) {
    return catchesCollection.insertOne(fish);
  }

  module.exports = {
    getUser,
    getUserByToken,
    getUserByUsername,
    addUser,
    updateUser,
    addCatch,
    removeUserToken,
  };