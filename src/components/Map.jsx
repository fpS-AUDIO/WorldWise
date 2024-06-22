import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

function Map() {
  const navigate = useNavigate();

  // useSearchParams hook returns an array with current url state and a function to update it
  const [searchParams, setSearchParams] = useSearchParams();

  // on searchParams object you need to call get() method and pass-in the quesry string variable name
  const lat = searchParams.get(`lat`);
  const lng = searchParams.get(`lng`);

  // this function will change the URL query string (global update)
  function changeCoords() {
    // setSearchParams accepts new object
    setSearchParams({ lat: 2324, lng: 3221 });
  }

  return (
    <div className={styles.mapContainer} onClick={() => navigate("form")}>
      <p>
        The coords of current URL are: {lat} and {lng}
      </p>

      <button onClick={changeCoords}>Change URL query string</button>
    </div>
  );
}

export default Map;
