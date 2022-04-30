// This component will disply a list of reservations (if they exist) dependant on the users id and if authenticated.

import React, { useState, useEffect } from "react";
import "./ReservationList.css";
import { Link } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
// Add auth0 authentication library
import { useAuth0 } from "@auth0/auth0-react";

const ReservationList = () => {
  const [reservations, setReservations] = useState({});
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // get user access token
  const { getAccessTokenSilently } = useAuth0();

  // fetch a list of all reservations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/reservations`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // Checks response for an error
        if (response.ok === false) {
          setIsNotFound(true);
          setIsLoading(false);
          setErrorMessage("You don't have any reservations.");
          return;
        }
        const data = await response.json();
        // Check to see if any data was returned from the database (scenario: empty database)
        if (data.length !== 0) {
          // sort the reservations by date (ascending) so 'upcoming' list is in chronological order
          data.sort((a, b) => {
            const c = new Date(a.date);
            const d = new Date(b.date);
            return c - d;
          });
          setReservations(data);
          setIsLoading(false);
          return;
        } else {
          setIsNotFound(true);
          setIsLoading(false);
          setErrorMessage("You don't have any reservations.");
          return;
        }
      } catch (error) {
        // catch required for when the app cannot connect to the server - 'ERR_CONNECTION_REFUSED 200'. This will occur when the api server has not been started.
        setErrorMessage(
          "An error has occured. Cannot connect to reservationizr server."
        );
        setIsNotFound(true);
        return;
      }
    };
    fetchData();
  }, [getAccessTokenSilently]);

  // handle error - no reservations found. Likely only if no data returned from database.
  if (isNotFound) {
    return (
      <>
        <h1>Upcoming reservations</h1>
        <p>{errorMessage}</p>
        <Link to={`/restaurants`} className='link-text'>
          <p>View the restaurants</p>
        </Link>
      </>
    );
  }

  // This is displayed to prevent rendering elements that are dependant on data from the async/await fetch request.
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Upcoming reservations</h1>
      <ul className='reservations-ul'>
        {reservations.map((reservation) => {
          return (
            <li key={reservation.id} className='reservation-list'>
              <h2>{reservation.restaurantName}</h2>
              <p>{formatDate(reservation.date)}</p>
              <Link
                to={`/reservations/${reservation.id}`}
                className='link-text'
              >
                <p>View Details&nbsp;&rarr;</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ReservationList;
