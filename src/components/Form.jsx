// "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import styles from "./Form.module.css";

import { useCities } from "../contexts/CitiesContext";
import useUrlPosition from "../hooks/useUrlPosition";

import Button from "./Button";
import ButtonBack from "./ButtonBack";
import Message from "./Message";

export function convertToEmoji(countryCode) {
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
}

function Form() {
  const { createCity, isLoading } = useCities();
  const navigate = useNavigate();
  const [mapLat, mapLng] = useUrlPosition();
  const [cityName, setCityName] = useState("");
  const [country, setCountry] = useState("");
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState("");
  const [isLoadingFetchCoords, setIsLoadingFetchCoords] = useState(false);
  const [errorMexFetchCoords, setErrorMexFetchCoords] = useState("");
  const [emoji, setEmoji] = useState("");
  const [startDate, setStartDate] = useState(new Date());

  useEffect(
    function () {
      if (!mapLat && !mapLng) return;

      // "https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=0&longitude=0"
      async function getPositionFromCoord() {
        try {
          setErrorMexFetchCoords("");
          setIsLoadingFetchCoords(true);
          const request = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${mapLat}&longitude=${mapLng}`
          );
          if (!request.ok)
            throw new Error(`Failed to fetch position from this coords`);
          const data = await request.json();

          if (!data.countryCode)
            throw new Error(`Please click somewhere else :)`);
          // updating state
          setCityName(data.city || data.countryName || "");
          setCountry(data.countryName);
          setEmoji(() => convertToEmoji(data.countryCode));
        } catch (err) {
          setErrorMexFetchCoords(err.message);
        } finally {
          setIsLoadingFetchCoords(false);
        }
      }
      getPositionFromCoord();
    },
    [mapLat, mapLng]
  );

  async function handleSubmitFunc(e) {
    e.preventDefault();

    if (!cityName || !date) return;

    const cityObject = {
      cityName,
      country,
      emoji,
      date,
      notes,
      position: {
        lat: mapLat,
        lng: mapLng,
      },
    };

    // wait the uploading data
    await createCity(cityObject);
    // then navigate
    navigate(`/app/cities`);
  }

  if (!mapLat && !mapLng)
    return <Message message={"Start by clicking somewhere on the map"} />;

  if (errorMexFetchCoords) return <Message message={errorMexFetchCoords} />;

  return (
    <form
      className={`${styles.form} ${isLoading ? styles.loading : ""}`}
      onSubmit={handleSubmitFunc}
    >
      <div className={styles.row}>
        <label htmlFor="cityName">City name</label>
        <input
          id="cityName"
          onChange={(e) => setCityName(e.target.value)}
          value={cityName}
        />
        <span className={styles.flag}>{emoji}</span>
      </div>

      <div className={styles.row}>
        <label htmlFor="date">When did you go to {cityName}?</label>
        {/* <input
          id="date"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        /> */}
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          dateFormat={`dd/MM/yyyy`}
          id="date"
        />
      </div>

      <div className={styles.row}>
        <label htmlFor="notes">Notes about your trip to {cityName}</label>
        <textarea
          id="notes"
          onChange={(e) => setNotes(e.target.value)}
          value={notes}
        />
      </div>

      <div className={styles.buttons}>
        <Button type={"primary"}>Add</Button>
        <ButtonBack />
      </div>
    </form>
  );
}

export default Form;
