// Unit test for getRestaurants function

const getRestaurants = require("./getRestaurants");

describe("getRestaurants function unit test:", () => {
  it("should return an array of three restaurant objects: ", async () => {
    const expectedBody = [
      {
        id: "616005cae3c8e880c13dc0b9",
        name: "Curry Place",
        description:
          "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
        image: "https://i.ibb.co/yftcRcF/indian.jpg",
      },
      {
        id: "616005e26d59890f8f1e619b",
        name: "Thai Isaan",
        description:
          "We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.",
        image: "https://i.ibb.co/HPjd2jR/thai.jpg",
      },
      {
        id: "616bd284bae351bc447ace5b",
        name: "Italian Feast",
        description:
          "From the Italian classics, to our one-of-a-kind delicious Italian favourites, all of our offerings are handcrafted from the finest, freshest ingredients available locally. Whether you're craving Italian comfort food like our Ravioli, Pappardelle or something with a little more Flavour like our famous Fettuccine Carbonara.",
        image: "https://i.ibb.co/0r7ywJg/italian.jpg",
      },
    ];

    let received = await getRestaurants();
    /* 
    The two lines below are required for the test as the '_id' model property transformation to 'id' does not happen to the returned data array of objects until it is JSONified, ie, by a 'response.send' method. Hence, by stringifying, the JSON tansform is applied in the schema model and then this is json.parsed back to an object leaving the '_id' property transformed to 'id' to pass the test with the received response in the correct format, as would be passed by the app.get response object. Alternatively, this test could test 'received' for the presence of object key/value pairs and an array length of (3), ie expect(received).toHaveProperty("name", "Curry Place") 
    */
    received = JSON.stringify(received);
    received = JSON.parse(received);

    expect(received).toEqual(expectedBody);
  });
});
