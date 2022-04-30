// Function to get a list of all reservations from the mongodb, reservations collection, The result is then returned.

const Reservation = require("../models/ReservationModel");

const getReservations = async () => {
  const result = await Reservation.find({});
  return result;
};
module.exports = getReservations;
