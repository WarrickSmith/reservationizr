// Unit test for getRestaurantById function

const getRestaurantById = require("./getRestaurantById");

describe("getRestaurantById function unit test:", () => {
  it("should return a single restaurant object: ", async () => {
    const expectedBody = {
      id: "616005cae3c8e880c13dc0b9",
      name: "Curry Place",
      description:
        "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
      image: "https://i.ibb.co/yftcRcF/indian.jpg",
    };

    const id = "616005cae3c8e880c13dc0b9";
    let received = await getRestaurantById(id);
    /* 
    The two lines below are required for the test as the '_id' model property transformation to 'id' does not happen to the returned data array of objects until it is JSONified, ie, by a 'response.send' method. Hence, by stringifying, the JSON tansform is applied in the schema model and then this is json.parsed back to an object leaving the '_id' property transformed to 'id' to pass the test with the received response in the correct format, as would be passed by the app.get response object. Alternatively, this test could test 'received' for the presence of object key/value pairs and an array length of (2), ie expect(received).toHaveProperty("userId", 614abe145f317b89a2e36883) 
    */
    received = JSON.stringify(received);
    received = JSON.parse(received);

    expect(received).toEqual(expectedBody);
  });
});
