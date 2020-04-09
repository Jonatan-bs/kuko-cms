const mongoose = require("mongoose");

//connect to database
mongoose.connect("mongodb://localhost:27017/kuko", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

//drop database
const connection = mongoose.connection;
connection.once("open", function () {
  console.log("*** MongoDB got connected ***");
  console.log(`Our Current Database Name : ${connection.db.databaseName}`);
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close();
    console.log(`${connection.db.databaseName} database dropped.`);
  });
});
