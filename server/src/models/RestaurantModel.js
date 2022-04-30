// mongoDB Model/Schema for database 'mongo', with the collection 'restaurants', which is a collection of restaurants represented as an array of restaurant objects.

const mongoose = require("mongoose");

const restaurantModel = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

module.exports = mongoose.model("Restaurant", restaurantModel);
