// This component will disply a single reservation based on the reseration 'id' (if one exists). The result is dependant on the user being authenticated.

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { formatDate } from "../utils/formatDate";
import "./Reservation.css";
import { Link } from "react-router-dom";
// Add auth0 authentication library
import { useAuth0 } from "@auth0/auth0-react";

const Reservation = () => {
  const { id } = useParams();
  const [reservation, setReservation] = useState({});
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // apiResponse used to store returned error object
  const [apiResponse, setApiResponse] = useState({});
  // get user access token
  const { getAccessTokenSilently } = useAuth0();

  // fetch a single reservation based on id
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/reservations/${id}`,
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
        setApiResponse(response);
        return;
      }

      const data = await response.json();
      setReservation(data);
      setIsLoading(false);
    };

    fetchData();
  }, [id, getAccessTokenSilently]);

  //handle error if returned based on error status code
  if (isNotFound) {
    if (apiResponse.status === 404) {
      return (
        <>
          <p className='error'>
            {apiResponse.statusText} - Sorry! That reservation id apprears to be
            invalid.
          </p>
          <Link to='/reservations' className='btn'>
            &larr; Back to reservations
          </Link>
        </>
      );
    } else if (apiResponse.status === 403) {
      return (
        <>
          <p className='error'>
            {apiResponse.statusText} - Sorry! you do not have permission to
            access that reservation.
          </p>
          <Link to='/reservations' className='btn'>
            &larr; Back to reservations
          </Link>
        </>
      );
    } else if (apiResponse.status === 401) {
      return (
        <>
          <p className='error'>
            {apiResponse.statusText} - Sorry! you have not been authorised to
            access that reservation.
          </p>
          <Link to='/reservations' className='btn'>
            &larr; Back to reservations
          </Link>
        </>
      );
    } else
      return (
        <>
          <p className='error'>
            {apiResponse.statusText}. Sorry! The reservation id is invalid
          </p>
          <Link to='/reservations' className='btn'>
            &larr; Back to reservations
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
      <h1>Reservation</h1>
      <ul className='reservation-ul'>
        <li key={reservation.id} className='reservation-list-item'>
          <h2>{reservation.restaurantName}</h2>
          <p>{formatDate(reservation.date)}</p>
          <p className='text-bold'>
            Party size:&nbsp;
            <span>{reservation.partySize}</span>
          </p>
        </li>
      </ul>
      <Link to='/reservations' className='btn'>
        &larr; Back to reservations
      </Link>
    </>
  );
};

export default Reservation;
