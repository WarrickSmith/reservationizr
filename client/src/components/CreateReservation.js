// This component is used to diplay a 'create reservation' form. It uses  a third party dtae picker component. The form requires a restaurant name, which is read from an api endppoint "/retaurants/:id". The form POST's data to "/reservations" endpoint.

import DatePicker from "react-datepicker";
import { useParams, useHistory, Link } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import { useState, useEffect } from "react";
import "./CreateReservation.css";

// Add auth0 authentication library
import { useAuth0 } from "@auth0/auth0-react";

// ** datepicker localisation for date format to en-GB dd/mm/yyyy
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { enGB } from "date-fns/locale";
registerLocale("en-NZ", enGB);
setDefaultLocale("en-NZ");

// Main function to create a reservation
const CreateReservation = () => {
  const { restaurantId } = useParams();
  const [partySize, setPartySize] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const history = useHistory();

  // Round date 'up' to nearest half hour so default value for DatePicker in not retrospective
  const roundUpTo = (roundTo) => (x) => Math.ceil(x / roundTo) * roundTo;
  const roundUpTo30Minutes = roundUpTo(1000 * 60 * 30);
  const roundTime = roundUpTo30Minutes(new Date());

  // startdate, setStartdate, date, setDate are used with the datepicker component
  const [startDate, setStartDate] = useState(new Date(roundTime));
  const [date, setDate] = useState(startDate);

  // get user access token to validate authorisation
  const { getAccessTokenSilently } = useAuth0();

  // fetch restaurant name using restaurantId provided in 'params'
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/restaurants/${restaurantId}`
      );
      const data = await response.json();
      setRestaurantName(data.name);
      setIsLoading(false);

      // Handle error condition for 404, restaurant not found, when looking up restaurant name for reservation form. This error can be triggered if the restaurant is deleted from the database after viewing restaurants but before you click 'reserve now'.
      if (response.ok === false) {
        setIsError(true);
        setErrorMessage(
          "Sorry - That Restaurant is not currently available for reservations."
        );
        return;
      }
      return;
    };
    fetchData();
  }, [restaurantId]);

  // submit POST request to reservations api endpoint
  const handleSubmit = async (event) => {
    event.preventDefault();

    // format POST request body
    const reservation = {
      partySize: Number(partySize),
      date,
      restaurantName,
    };
    setIsLoading(true);
    const accessToken = await getAccessTokenSilently();
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/reservations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(reservation),
      }
    );

    // Error handling extracts the specific error message from the response and assigns it to 'errorMessage'
    if (!response.ok) {
      setIsError(true);
      const errorData = JSON.parse(await response.text());
      setErrorMessage(errorData.validation.body.message);
    } else {
      setIsLoading(false);
      history.push("/reservations");
    }
  };

  // If there is an error, this element is returns with appropriate error message
  if (isError) {
    return (
      <>
        <p className='no-reservation'>Error creating a reservation!</p>
        <p>{errorMessage}</p>
        <Link to='/restaurants' className='btn'>
          &larr; Back to restaurants
        </Link>
      </>
    );
  }

  // check if date picked is greater than or equal to now, set date variables and store date as ISO string for POSTing
  const handleDateChange = (newDate) => {
    if (newDate >= new Date()) {
      setStartDate(newDate);
      setDate(newDate.toISOString());
    } else return;
  };

  // Datepicker function to filter passed time (shows greyed out0)
  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);
    return currentDate.getTime() < selectedDate.getTime();
  };

  return (
    <>
      <h1>Reserve {restaurantName}</h1>
      <form onSubmit={handleSubmit} className='form-wrapper'>
        <div className='form-box'>
          <label htmlFor='partySize' className='form-label'>
            Number of guests
          </label>
          <input
            type='number'
            id='partySize'
            className='form-input'
            value={partySize}
            onChange={(event) => {
              setPartySize(event.target.value);
            }}
            required
          />
        </div>
        <div className='form-box'>
          <label htmlFor='date' className='form-label'>
            Date
          </label>

          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            showTimeSelect
            dateFormat='Pp'
            id='date'
            local='en-NZ'
            minDate={new Date()}
            filterTime={filterPassedTime}
            className='form-input'
          />
        </div>
        <div>
          <button className='btn-submit' disabled={isLoading}>
            Submit
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateReservation;
