import { useSearchParams } from "react-router-dom";

export function useUrlPosition() {
  const [searchParams, setSearchParams] = useSearchParams();
  // on searchParams object you need to call get() method and pass-in the quesry string variable name
  const lat = searchParams.get(`lat`);
  const lng = searchParams.get(`lng`);

  return [lat, lng];
}

export default useUrlPosition;
