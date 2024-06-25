import { useNavigate } from "react-router-dom";
import { useFakeAuth } from "../contexts/fakeAuthContext";
import { useEffect } from "react";

// simple component which checks is used is authenticated
// to prevent any user to access to app throu the routes manually

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useFakeAuth();
  const navigate = useNavigate();
  useEffect(
    function () {
      if (!isAuthenticated) navigate(`/`);
    },
    [isAuthenticated, navigate]
  );
  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
