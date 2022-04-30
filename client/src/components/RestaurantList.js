// This component will disply a list of restaurnats (if they exist). The user does not have to be authenticated to see available restaurants.

import React, { useState, useEffect } from "react";
import "./RestaurantList.css";
import { Link } from "react-router-dom";

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState({});
  const [isNotFound, setIsNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // fetch a list of all restaurants
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/restaurants`
        );
        if (response.ok === false) {
          setIsNotFound(true);
          setIsLoading(false);
          setErrorMessage("Sorry! We can't find any restaurants");
          return;
        }
        const data = await response.json();
        // Check to see if any data was returned from the database (scenario: empty database)
        if (data.length !== 0) {
          setRestaurants(data);
          setIsLoading(false);
          return;
        } else {
          setIsNotFound(true);
          setIsLoading(false);
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
  }, []);

  // handle error - no restaurants found. Likely only if no data returned from database or the api server cannot be reached.
  if (isNotFound) {
    return (
      <>
        <p className='error'>{errorMessage}</p>
      </>
    );
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Restaurants</h1>
      <ul className='restaurants-ul'>
        {restaurants.map((restaurant) => {
          return (
            <li key={restaurant.id} className='restaurant-list'>
              <div>
                <img src={restaurant.image} alt='Restaurant Food' />
              </div>
              <div>
                <h2 className='restaurant-name'>{restaurant.name}</h2>
                <p>{restaurant.description}</p>
                <Link
                  to={`/restaurants/${restaurant.id}/reserve`}
                  className='btn-red'
                >
                  <p className='text-bold-white'>Reserve now&nbsp;&rarr;</p>
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default RestaurantList;
