const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId;
//const db = getDB();

// Connection URL
// Ska ofta (alltid) vara denna url
const url = "mongodb://localhost:27017";

// Database name
// Kan heta vad som helst
const dbName = "labbDB";

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });
client.connect();
let db = client.db(dbName);

// koden stannar på result till den hämtat alla rum, sen går den vidare

async function getAllRooms() {
  try {
    const result = await db.collection("roomsCollection").find().toArray();
    console.log("RESULT från DB.js", result);
    return result;
  } catch (error) {
    console.log("Cannot get all rooms", error);
    throw error;
  }
}

// tar emot posten newRoom från servern
async function createNewRoom(newRoom) {
  try {
    const result = await db.collection("roomsCollection").insert(newRoom);
    return "Success in creating a new room";
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

module.exports.getAllRooms = getAllRooms;
module.exports.createNewRoom = createNewRoom;

/* module.exports = {
  getClient: function () {
    return client;
  },
  getDB: function () {
    let client = module.exports.getClient();
    let db = client.db(dbName);
    return db;
  },
  createObjectId(id){
      return new ObjectId(id);
  }
};
 */
