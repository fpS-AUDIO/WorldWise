import { Link } from "react-router-dom";
import styles from "./CityItem.module.css";
import { useCities } from "../contexts/CitiesContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity } = useCities();

  // example of position object
  // console.log(city.position); // Output: {lat: 52.53586782505711, lng: 13.376933665713324}

  // To add the query string (with or without params) you need to add:
  //    '?' (question mark)
  //    then query variable
  //    then '=' (equal sign)
  //    then its value
  //    use '&' to add more params
  // SYNTAX:  url/url/?variableName1=value&variableName2=value

  // PARAMS:        ${city.id}
  // QUESRY STRING: ?lat=${city.position.lat}&lng=${city.position.lng}
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          currentCity.id === city.id ? styles["cityItem--active"] : ""
        }`}
        to={`/app/cities/${city.id}?lat=${city.position.lat}&lng=${city.position.lng}`}
      >
        <span className={styles.emoji}>{city.emoji}</span>
        <h3 className={styles.name}>{city.cityName}</h3>
        <time className={styles.time}>{formatDate(city.date)}</time>
        <button className={styles.deleteBtn}>&times;</button>
      </Link>
    </li>
  );
}

export default CityItem;
