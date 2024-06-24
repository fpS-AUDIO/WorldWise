import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./Map.module.css";

import { useGeolocation } from "../hooks/useGeolocations";

// importing react leaflet modules
import {
  MapContainer,
  TileLayer,
  useMap,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";

import { useCities } from "../contexts/CitiesContext";
import { useEffect, useState } from "react";
import Button from "./Button";
import useUrlPosition from "../hooks/useUrlPosition";

function Map() {
  // useCities is custom hook coming from CitiesContext
  const { cities } = useCities();
  const [position, setPosition] = useState([45, 10]);
  const [mapLat, mapLng] = useUrlPosition();

  // useSearchParams hook returns an array with current url state and a function to update it
  // const [searchParams, setSearchParams] = useSearchParams();
  // from custom hook 'useGeolocation'
  const {
    isLoading: isLoadingPosition,
    position: positionGeolocation,
    getPosition,
  } = useGeolocation();

  // exported to a custom hook!
  // on searchParams object you need to call get() method and pass-in the quesry string variable name
  // const mapLat = searchParams.get(`lat`);
  // const mapLng = searchParams.get(`lng`);

  // effect to synchronize the 'position' with the 'mapLat' and 'mapLng'
  // this way map remains on the last coord and don't raturn to the origin coords
  useEffect(
    function () {
      if (mapLat && mapLng) setPosition([mapLat, mapLng]);
    },
    [mapLat, mapLng]
  );

  // effect to update Position with the current one
  useEffect(
    function () {
      if (positionGeolocation)
        setPosition([positionGeolocation.lat, positionGeolocation.lng]);
    },
    [positionGeolocation]
  );

  return (
    <div className={styles.mapContainer}>
      <Button type="position" onClick={getPosition}>
        {isLoadingPosition ? "LOADING..." : "GET POSTION"}
      </Button>

      <MapContainer
        className={styles.map}
        center={position}
        // center={[mapLat, mapLng]}
        zoom={7}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.fr/hot/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          return (
            <Marker
              key={city.id}
              position={[city.position.lat, city.position.lng]}
            >
              <Popup>
                <span>{city.emoji}</span>
                {city.cityName}
              </Popup>
            </Marker>
          );
        })}

        <ChangeCenter position={position} />
        <DetectClick />
      </MapContainer>
    </div>
  );
}

// REMEMBER TO INCLUDE THE FOLLOWING COMPONENTS INSIDE THE </MapContainer> LEAFLET PARENT COMPONENT

// creating custom component called ChangeCenter (can be called in any way)
function ChangeCenter({ position }) {
  // using 'useMap' hook given by leaflet library
  // 'useMap' returns instance of the current displayed component map
  const map = useMap();

  // change the center of map to given coords
  map.setView(position);

  return null;
}

// creating custom component to implement "onClick" on leaflet map
function DetectClick() {
  const navigate = useNavigate();

  // using react leaflet library hook 'useMapEvents'
  // 'useMapEvents' accepts an object with types of events
  useMapEvents({
    // click event with provided callback function
    click: (e) => {
      // console.log(e); // returns object event
      navigate(`form/?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });
}

export default Map;
