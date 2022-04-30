// Unit test for getReservationById function

const getReservationById = require("./getReservationById");

describe("getReservationById function unit test:", () => {
  it("should return a single reservation object: ", async () => {
    const expectedBody = {
      id: "507f1f77bcf86cd799439011",
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      userId: "mock-user-id",
      restaurantName: "Island Grill",
    };

    const id = "507f1f77bcf86cd799439011";
    let received = await getReservationById(id);
    /* 
    The two lines below are required for the test as the '_id' model property transformation to 'id' does not happen to the returned data array of objects until it is JSONified, ie, by a 'response.send' method. Hence, by stringifying, the JSON tansform is applied in the schema model and then this is json.parsed back to an object leaving the '_id' property transformed to 'id' to pass the test with the received response in the correct format, as would be passed by the app.get response object. Alternatively, this test could test 'received' for the presence of object key/value pairs and an array length of (2), ie expect(received).toHaveProperty("userId", 614abe145f317b89a2e36883) 
    */
    received = JSON.stringify(received);
    received = JSON.parse(received);

    expect(received).toEqual(expectedBody);
  });
});
