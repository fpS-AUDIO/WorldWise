import { createContext, useEffect, useContext, useReducer } from "react";

// ----- custom component with Context API and a custom hook

// creating context
const CityContext = createContext();

// base URL (run the json-server locally)
const CITIES_API = "http://localhost:9000";

const initialState = {
  isLoading: false,
  cities: [],
  currentCity: {},
  errorMessage: ``,
};

// the reduce function called by dispatch of useReducer
function reducer(state, action) {
  switch (action.type) {
    case `loading`:
      return {
        ...state,
        isLoading: true,
      };

    case `cities/fetched`:
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };

    case `city/loaded`:
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };

    case `city/created`:
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };

    case `city/deleted`:
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };

    case `rejected`:
      return {
        ...state,
        errorMessage: action.payload,
        isLoading: false,
      };

    default:
      throw new Error(
        `The reduce function (useReducer) didn't detect the action.type`
      );
  }
}

// custom component (wrapper)
function CitiesProvider({ children }) {
  // state is managed by useReducer (+ Context API)
  const [{ cities, isLoading, currentCity, errorMessage }, dispatch] =
    useReducer(reducer, initialState);

  // effect to fetch cities list from json-server
  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: `loading` });

      try {
        const data = await fetch(`${CITIES_API}/cities`);
        if (!data.ok) return new Error(`Can't fetch cities`);
        const cities = await data.json();
        dispatch({
          type: `cities/fetched`,
          payload: cities,
        });
      } catch (err) {
        dispatch({
          type: `rejected`,
          payload: err.message,
        });
      }
    }
    fetchCities();
  }, []);

  // method to fetch more info about current city
  async function getCity(id) {
    if (Number(id) === currentCity.id) return;

    dispatch({ type: `loading` });
    try {
      const data = await fetch(`${CITIES_API}/cities/${id}`);
      if (!data.ok) throw new Error(`Can't fetch current city with id: ${id}`);
      const city = await data.json();

      dispatch({
        type: `city/loaded`,
        payload: city,
      });
    } catch (err) {
      dispatch({
        type: `rejected`,
        payload: err.message,
      });
    }
  }

  async function createCity(newCity) {
    dispatch({ type: `loading` });
    try {
      // POST request
      const response = await fetch(`${CITIES_API}/cities`, {
        method: `POST`,
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      dispatch({
        type: `city/created`,
        payload: data,
      });
    } catch (err) {
      dispatch({
        type: `rejected`,
        payload: err.message,
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: `loading` });

    try {
      // DELETE request
      await fetch(`${CITIES_API}/cities/${id}`, {
        method: `DELETE`,
      });

      dispatch({
        type: `city/deleted`,
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: `rejected`,
        payload: err.message,
      });
    }
  }
  // returing custom component with a provided value
  // since the data is async, don't pass dispatch function to context provider
  // but passing the event handler helper functions (sort of public api)
  return (
    <CityContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        errorMessage,
        getCity,
        createCity,
        deleteCity,
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
