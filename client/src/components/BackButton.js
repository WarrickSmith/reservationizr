// This component is leverage by other components to show a consistent button linked to /reservations

import { Link } from "react-router-dom";

const BackButton = () => {
  return (
    <Link to='/reservations' className='btn'>
      &larr; Back to reservations
    </Link>
  );
};

export default BackButton;
