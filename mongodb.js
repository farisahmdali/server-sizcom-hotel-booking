const { MongoClient } = require("mongodb");
require("dotenv").config();

let db = null;

module.exports = {
  connectDb: async () => {
    try {
      const url = process.env.DB_CONNECTION;
      const client = await MongoClient.connect(url);
      console.log("db conected");
      db = client.db("thalia");
    } catch (err) {
      console.log(err);
    }
  },

  getDb: () => {
    if (!db) {
      console.log("database not connected");
    }

    return db;
  },
};
