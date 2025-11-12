const { MongoClient } = require('mongodb');
const config = require('./dbConfig.json');

const url = `mongodb+srv://${config.userName}:${config.password}@${config.hostname}`;
const client = new MongoClient(url);
const db = client.db('outfishn');
const usersCollection = db.collection('users');
const catchesCollection = db.collection('catches');
const requestCollection = db.collection('friendRequests');


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

  async function addFriend(userEmail, friendEmail) {
    await usersCollection.updateOne(
      { email: userEmail },
      { $addToSet: { friends: friendEmail } }
    );
  }

  async function addCatch(fish) {
    return catchesCollection.insertOne(fish);
  }

  async function getCatchesByUser(username) {
    return catchesCollection.find( { angler: username}).toArray();
  }

  async function getSocialCatches(anglerList) {
    return catchesCollection.find({ angler: { $in: anglerList } }).sort({ weight: -1, timestamp: -1 }).toArray();
  }

  async function getAllUsernames() {
    const users = await usersCollection.find({}, { projection: { username: 1 } }).toArray();
    return users.map(user => user.username);
  }

  async function addPendingRequest(request) {
    return requestCollection.insertOne(request);
  }

  async function getPendingRequests(receiverUsername) {
    return requestCollection.find({ receiverUsername: receiverUsername}).toArray();
  }

  async function removePendingRequest(senderUsername, receiverUsername) {
    return requestCollection.deleteOne({
      senderUsername: senderUsername,
      receiverUsername: receiverUsername,
    });
  }

  module.exports = {
    getUser,
    getUserByToken,
    getUserByUsername,
    addUser,
    updateUser,
    addCatch,
    removeUserToken,
    addFriend,
    getCatchesByUser,
    getSocialCatches,
    getAllUsernames,
    addPendingRequest,
    getPendingRequests,
    removePendingRequest,
  };