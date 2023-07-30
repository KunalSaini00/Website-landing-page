const { Database } = require("./db");

const db = new Database("127.0.0.1", 700, "database.json");
db.Save();
