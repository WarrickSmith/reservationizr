// Unit test for getReservations function

const getReservations = require("./getReservations");

describe("getReservations function unit test:", () => {
  it("should return an array of three reservation objects: ", async () => {
    const expectedBody = [
      {
        id: "507f1f77bcf86cd799439011",
        partySize: 4,
        date: "2023-11-17T06:30:00.000Z",
        userId: "mock-user-id",
        restaurantName: "Island Grill",
      },
      {
        id: "614abf0a93e8e80ace792ac6",
        partySize: 2,
        date: "2023-12-03T07:00:00.000Z",
        userId: "mock-user-id",
        restaurantName: "Green Curry",
      },
      {
        id: "61679189b54f48aa6599a7fd",
        partySize: 2,
        date: "2023-12-03T07:00:00.000Z",
        userId: "another-user-id",
        restaurantName: "Green Curry",
      },
    ];

    let received = await getReservations();
    /* 
    The two lines below are required for the test as the '_id' model property transformation to 'id' does not happen to the returned data array of objects until it is JSONified, ie, by a 'response.send' method. Hence, by stringifying, the JSON tansform is applied in the schema model and then this is json.parsed back to an object leaving the '_id' property transformed to 'id' to pass the test with the received response in the correct format, as would be passed by the app.get response object. Alternatively, this test could test 'received' for the presence of object key/value pairs and an array length of (3), ie expect(received).toHaveProperty("restaurantName", "Island Grill") 
    */
    received = JSON.stringify(received);
    received = JSON.parse(received);

    expect(received).toEqual(expectedBody);
  });
});
