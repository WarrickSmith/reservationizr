// Function to get a list of all restaurants from the mongodb, restaurants collection, The result is then returned.

const Restaurant = require("../models/RestaurantModel");

const getRestaurants = async () => {
  const result = await Restaurant.find({});
  return result;
};
module.exports = getRestaurants;
