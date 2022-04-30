const express = require("express");
const cors = require("cors");
const app = express();
// Auth0 dependancies
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");

// Project Module, Schema & Utils imports
const validId = require("./utils/validId");
const getRestaurants = require("./modules/getRestaurants");
const getRestaurantById = require("./modules/getRestaurantById");
const getReservations = require("./modules/getReservations");
const getReservationById = require("./modules/getReservationById");
const Reservation = require("./models/ReservationModel");
const { celebrate, errors, Segments } = require("celebrate");
const reservationSchema = require("./models/ReservationSchema");

app.use(cors());
app.use(express.json());

// Authorisation middleware - Auth0
const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-2cf59a31.us.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: "https://reservationizr.com",
  issuer: [`https://dev-2cf59a31.us.auth0.com/`],
  algorithms: ["RS256"],
});

// Restaurants Endpoint Route to show all restaurants
app.get("/restaurants", async (request, response) => {
  const result = await getRestaurants();
  return response.status(200).send(result);
});

// Restaurants Endpoint Route to show a single restaurant
app.get("/restaurants/:id", async (request, response) => {
  const id = request.params.id;
  const valid = validId(id);
  if (valid) {
    const result = await getRestaurantById(id);
    if (result) {
      return response.status(200).send(result);
    } else {
      return response.status(404).send({
        error: "restaurant not found",
      });
    }
  } else {
    return response.status(400).send({ error: "invalid id provided" });
  }
});

// Reservations Endpoint Route to show all reservations
app.get("/reservations", checkJwt, async (request, response) => {
  // fetch a list of all reservations
  let result = await getReservations();

  // filter reservations by userid (request.user.sub from request header) and return filtered list
  result = result.filter((validUser) => validUser.userId === request.user.sub);

  return response.status(200).send(result);
});

// Reservations Endpoint Route to show a single reservation -> /reservations/:id
app.get("/reservations/:id", checkJwt, async (request, response) => {
  const id = request.params.id;
  const valid = validId(id);
  const userId = request.user.sub;
  if (valid) {
    const result = await getReservationById(id);
    if (result === null) {
      return response.status(404).send({
        error: "not found",
      });
    } else if (result.userId !== userId) {
      return response.status(403).send({
        error: "user does not have permission to access this reservation",
      });
    } else {
      return response.status(200).send(result);
    }
  } else {
    return response.status(400).send({
      error: "invalid id provided",
    });
  }
});

// Reservations endpoint route for reservations POST request -> /reservations

app.post(
  "/reservations",
  checkJwt,
  celebrate({
    [Segments.BODY]: reservationSchema,
  }),
  async (request, response, next) => {
    const { body, user } = request;
    const document = { userId: user.sub, ...body };
    const newReservation = await Reservation.create(document);
    return response.status(201).send(newReservation);
  }
);

// Note: app.use(errors..) handles errors for celebrate library, ie, 400 bad request on /reservations POST route
app.use(errors());
module.exports = app;
