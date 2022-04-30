// Function to get a single reservation from the mongodb, reservations collection, based on the reservationId (passed as an argument). The result is then returned.

const Reservation = require("../models/ReservationModel");

const getReservationById = async (id) => {
  const result = await Reservation.findById(id);
  return result;
};
module.exports = getReservationById;
