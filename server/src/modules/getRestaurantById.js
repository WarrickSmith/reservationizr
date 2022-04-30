// Function to get a single restaurant from the mongodb, restaurants collection, based on the restaurantId (passed as an argument). The result is then returned.

const Restaurant = require("../models/RestaurantModel");

const getRestaurantById = async (id) => {
  const result = await Restaurant.findById(id);
  return result;
};
module.exports = getRestaurantById;
