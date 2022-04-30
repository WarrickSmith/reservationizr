// This function will take in a date argument, format and return the formatted result (local readable time and date)

import { format } from "date-fns";

const formatDate = (date) => format(new Date(date), "h:mmaaa EEE d LLL, yyyy");

export { formatDate };
