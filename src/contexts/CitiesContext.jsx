import { createContext, useState, useEffect, useContext } from "react";

// ----- custom component with Context API and a custom hook

// creating context
const CityContext = createContext();

const CITIES_API = "http://localhost:9000";

// custom component (wrapper)
function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState({});

  // effect to fetch cities list from json-server
  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const data = await fetch(`${CITIES_API}/cities`);

        if (!data.ok) return new Error(`Can't fetch cities`);
        const cities = await data.json();

        setCities(() => cities);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  // method to fetch more info about current city
  async function getCity(id) {
    try {
      setIsLoading(true);
      const data = await fetch(`${CITIES_API}/cities/${id}`);

      if (!data.ok)
        return new Error(`Can't fetch current city with id of ${id}`);
      const city = await data.json();

      setCurrentCity(() => city);
    } catch (err) {
      console.log(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  // returing custom component with a provided value
  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
      }}
    >
      {children}
    </CityContext.Provider>
  );
}

// custom hook to get the context data (like public API)
function useCities() {
  // get the value from context
  const contextValue = useContext(CityContext);

  // guard clause: check if somebody tries to use it outside of context scope
  if (contextValue === undefined)
    throw new Error(`useCities is used outside of the CitiesProvider scope`);

  return contextValue;
}

// exporting custom context component and hook
export { CitiesProvider, useCities };
