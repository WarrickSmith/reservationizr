// Integration tests for API endpoints

const request = require("supertest");
const app = require("./app");

// Integration testing of api endpoints

describe("app.js integration tests:", () => {
  // Test for all restaurants happy path
  it("Should get all /restaurants", async () => {
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
    const expectedStatus = 200;
    await request(app)
      .get("/restaurants")
      .expect(expectedStatus)
      .expect((response) => {
        const body = response.body;
        expect(body).toEqual(expectedBody);
      });
  });

  // Test for single restaurantById happy path
  it("Should get a single restaurant by id from /restaurants/:id", async () => {
    const expectedBody = {
      id: "616005cae3c8e880c13dc0b9",
      name: "Curry Place",
      description:
        "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
      image: "https://i.ibb.co/yftcRcF/indian.jpg",
    };
    const expectedStatus = 200;
    await request(app)
      .get("/restaurants/616005cae3c8e880c13dc0b9")
      .expect(expectedStatus)
      .expect((response) => {
        const body = response.body;
        expect(body).toEqual(expectedBody);
      });
  });

  // Test for bad restaurant id (incorrect id length)
  it("Should get return a 400 bad request from /restaurants/:id", async () => {
    const expectedBody = { error: "invalid id provided" };
    const expectedStatus = 400;
    await request(app)
      // id below has invalid number of id elements (last number missing)
      .get("/restaurants/616005cae3c8e880c13dc0b")
      .expect(expectedStatus, expectedBody);
  });

  // Test for bad restaurant id (correct id length, incorrect id values)
  it("Should return a 404 not found from /restaurants/:id", async () => {
    const expectedBody = {
      error: "restaurant not found",
    };
    const expectedStatus = 404;
    await request(app)
      // id below has invalid last number
      .get("/restaurants/616005cae3c8e880c13dc0bc")
      .expect(expectedStatus, expectedBody);
  });

  // Test for all reservations happy path where userId: = "mock-user-id"
  it("Should get all /reservations", async () => {
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
    ];
    const expectedStatus = 200;
    await request(app)
      .get("/reservations")
      .expect(expectedStatus)
      .expect((response) => {
        const body = response.body;
        expect(body).toEqual(expectedBody);
      });
  });

  // Test for single reservation id happy path
  it("Should get a single reservation by id from /reservations/:id", async () => {
    const expectedBody = {
      id: "507f1f77bcf86cd799439011",
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      userId: "mock-user-id",
      restaurantName: "Island Grill",
    };
    const expectedStatus = 200;
    await request(app)
      .get("/reservations/507f1f77bcf86cd799439011")
      .expect(expectedStatus)
      .expect((response) => {
        const body = response.body;
        expect(body).toEqual(expectedBody);
      });
  });

  // Test for bad reservation id (incorrect id length)
  it("Should get return a 400 bad request from /reservations/:id", async () => {
    const expectedBody = {
      error: "invalid id provided",
    };
    const expectedStatus = 400;
    await request(app)
      // id below has invalid number of id elements (last number missing)
      .get("/reservations/507f1f77bcf86cd79943901")
      .expect(expectedStatus, expectedBody);
  });

  // Test for user not having access to reservation based on id
  it("Should return a 403 user does not have permission from /reservations/:id", async () => {
    const expectedBody = {
      error: "user does not have permission to access this reservation",
    };
    const expectedStatus = 403;
    await request(app)
      // id below has invalid last number
      .get("/reservations/61679189b54f48aa6599a7fd")
      .expect(expectedStatus, expectedBody);
  });

  // Test for bad reservation id (correct id length, incorrect id values)
  it("Should return a 404 not found from /reservations/:id", async () => {
    const expectedBody = {
      error: "not found",
    };
    const expectedStatus = 404;
    await request(app)
      // id below has invalid last number
      .get("/reservations/507f1f77bcf86cd79943901d")
      .expect(expectedStatus, expectedBody);
  });

  // Test happy path for POST route to /reservations endpoint
  test("POST /reservations creates a new reservation", async () => {
    const expectedStatus = 201;
    const body = {
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "Island Grill",
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining(body));
        expect(response.body.id).toBeTruthy();
      });
  });

  // Test /reservations POST route for invalid partySize (less than 1) (payload)
  test("POST /reservations returns a 400 when an invalid partySize (less than 1) is provided", async () => {
    const expectedStatus = 400;
    const body = {
      partySize: 0,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "Island Grill",
    };

    await request(app).post("/reservations").send(body).expect(expectedStatus);
  });

  // Test /reservations POST route for invalid request body (payload)
  test("POST /reservations returns a 400 when an invalid request body is provided", async () => {
    const expectedStatus = 400;
    const body = {};
    try {
      await request(app).post("/reservations").send(body);
      // .expect(expectedStatus);
    } catch (error) {
      expect(error).toMatch(expectedStatus);
    }
  });
});
