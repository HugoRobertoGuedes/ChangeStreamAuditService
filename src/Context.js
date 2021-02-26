import MongoClient from "mongodb";

// Vars
var _db;

/**
 * Create connection to MongoDB
 * @param {URL to server MongoDB} url
 * @param {Name To Database} dbName
 * @param {Function Callback} callback
 */
async function CreateConnection(url) {
  const client = await new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect().then(() => {
    _db = client;
  });
}

function GetConnection(dbName) {
  return _db.db(dbName);
}

export { CreateConnection, GetConnection };
