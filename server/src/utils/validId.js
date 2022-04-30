// code below reused from 02-project---reservationizer-application---get-requests-WarrickSmith
// this function checks an id variable to ensure it is a valid MongoDb 'format'. It does 'not' check to see if the id is present as a record in the MongoDB itself.

const mongoose = require("mongoose");

const validId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = validId;
