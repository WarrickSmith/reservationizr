// A test suite to unit test the joi/celebrate reservation schema

const reservationSchema = require("./ReservationSchema");

describe("ReservationSchema", () => {
  it("should require a partySize", async () => {
    expect.assertions(2);
    const valid = {
      partySize: 1,
      date: new Date("2023-09-17T06:30:00.000Z"),
      restaurantName: "abc",
    };
    const receivedValid = await reservationSchema.validateAsync(valid);
    expect(receivedValid).toEqual(valid);

    try {
      const invalid = {
        date: new Date("2023-09-17T06:30:00.000Z"),
        restaurantName: "abc",
      };
      await reservationSchema.validateAsync(invalid);
    } catch (error) {
      expect(error.message).toEqual('"partySize" is required');
    }
  });

  it("should require partySize to be greater than or equal to 1", async () => {
    expect.assertions(1);
    try {
      const invalid = {
        partySize: 0,
        date: new Date("2023-09-17T06:30:00.000Z"),
        restaurantName: "abc",
      };
      await reservationSchema.validateAsync(invalid);
    } catch (error) {
      expect(error.message).toEqual(
        '"partySize" must be greater than or equal to 1'
      );
    }
  });
  it("should require date to be now or in the future", async () => {
    expect.assertions(1);
    try {
      const invalid = {
        partySize: 4,
        date: new Date("2019-09-17T06:30:00.000Z"),
        restaurantName: "abc",
      };
      await reservationSchema.validateAsync(invalid);
    } catch (error) {
      expect(error.message).toEqual(
        '"date" must be greater than or equal to "now"'
      );
    }
  });
});
