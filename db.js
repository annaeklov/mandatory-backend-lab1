const mongo = require("mongodb");
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId;

// Connection URL
// Ska ofta (alltid) vara denna url
const url = "mongodb://localhost:27017";

// Database name
// Kan heta vad som helst
// Heter labbDB nu
const dbName = "labbDB";

// Create a new MongoClient
const client = new MongoClient(url, { useUnifiedTopology: true });
client.connect();
let db = client.db(dbName);

// koden stannar på result till den hämtat alla rum, sen går den vidare

async function getAllRooms() {
  try {
    const result = await db.collection("roomsCollection").find().toArray();
    return result;
  } catch (error) {
    console.log("Cannot get all rooms", error);
    throw error;
  }
}

// roomId kommer från servern
async function getOneRoom(roomId) {
  try {
    const result = await db
      .collection("roomsCollection")
      .find({ _id: ObjectId(roomId) })
      .toArray();
    return result;
  } catch (error) {
    console.log("Cannot get one room", error);
    throw error;
  }
}

// tar emot posten newRoom från servern
async function createNewRoom(newRoom) {
  try {
    const result = await db.collection("roomsCollection").insert(newRoom);
    return "Success in creating a new room";
  } catch (error) {
    console.log("Error in creating a new room", error);
    throw error;
  }
}

async function deleteRoom(roomId) {
  try {
    const result = await db
      .collection("roomsCollection")
      .deleteOne({ _id: ObjectId(roomId) });
    if (result.length) {
      return "Success in deleting a room";
    }
    return "Could not find room";
  } catch (error) {
    console.log("Error in deleting a room", error);
    throw error;
  }
}

async function saveMessage(newMessage) {
  try {
    const result = await db.collection("roomsCollection").updateOne(
      { _id: ObjectId(newMessage.roomId) },
      {
        $push: {
          messages: newMessage,
        },
      }
    );
    return "Success in saving a new message";
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
}

module.exports.getAllRooms = getAllRooms;
module.exports.getOneRoom = getOneRoom;
module.exports.createNewRoom = createNewRoom;
module.exports.deleteRoom = deleteRoom;
module.exports.saveMessage = saveMessage;

