import { useEffect } from "react";
import { useParams } from "react-router-dom";

import styles from "./City.module.css";

import { useCities } from "../contexts/CitiesContext";
import Spinner from "./Spinner";
import ButtonBack from "./ButtonBack";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  // from URL
  const paramsObj = useParams();

  // from custom hook (CitiesContext)
  const { getCity, currentCity, isLoading } = useCities();

  // useSearchParams hook returns an array with current url state and a function to update it
  // const [searchParams, setSearchParams] = useSearchParams();

  // on searchParams object you need to call get() method and pass-in the quesry string variable name
  // const lat = searchParams.get(`lat`);
  // const lng = searchParams.get(`lng`);

  // effect used to get info about current city (CitiesContext)
  useEffect(
    function () {
      getCity(paramsObj.id);
    },
    [paramsObj]
  );

  // destrucure some usuful data from current city
  const { cityName, emoji, date, notes } = currentCity;

  // early return in case when data is still fetching
  if (isLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <ButtonBack />
      </div>
    </div>
  );
}

export default City;
