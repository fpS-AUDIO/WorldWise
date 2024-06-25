import { createContext, useContext, useReducer } from "react";

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
};

function reduce(state, action) {
  switch (action.type) {
    case `user/login`:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };

    case `user/logout`:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    default:
      throw new Error(
        `action.type is not detected by reduce of fakeAuthContext`
      );
  }
}

// custom component AuthContext Provider
function AuthContextProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reduce,
    initialState
  );

  function logIn(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: `user/login`, payload: FAKE_USER });
    }
  }

  function logOut() {
    dispatch({ type: `user/logout` });
  }

  return (
    <AuthContext.Provider value={{ logIn, logOut, user, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

// custom hook which provides AuthContext
function useFakeAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error(`useFakeAuth is used outside of the AuthContextProvider`);
  return context;
}

export { AuthContextProvider, useFakeAuth };
