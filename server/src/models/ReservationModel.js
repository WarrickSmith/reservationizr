// mongoDB Model/Schema for database 'mongo', with the collection 'reservations', which is a collection of reservations represented as an array of restervation objects.

const mongoose = require("mongoose");

const reservationModel = mongoose.Schema(
  {
    partySize: { type: Number, required: true },
    date: { type: Date, required: true },
    userId: { type: String, required: true },
    restaurantName: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

module.exports = mongoose.model("Reservation", reservationModel);
