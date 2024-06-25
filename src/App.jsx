import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CitiesProvider } from "./contexts/CitiesContext";
import { AuthContextProvider } from "./contexts/fakeAuthContext";

import ProtectedRoute from "./pages/ProtectedRoute";
import Homepage from "./pages/Homepage";
import Product from "./pages/Product";
import Login from "./pages/Login";
import Pricing from "./pages/Pricing";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import CityList from "./components/CityList";
// import CountryList from "./components/CountryList";
import City from "./components/City";
import Form from "./components/Form";

function App() {
  return (
    <CitiesProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />}></Route>
            <Route path="product" element={<Product />}></Route>
            <Route path="pricing" element={<Pricing />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route
              path="app"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* nested routes */}
              <Route index element={<CityList />}></Route>
              <Route path="cities" element={<CityList />}></Route>

              <Route path="cities/:id" element={<City />}></Route>

              <Route path="countries" element={<City />}></Route>
              <Route path="form" element={<Form />}></Route>
            </Route>
            <Route path="*" element={<PageNotFound />}></Route>
          </Routes>
        </BrowserRouter>
      </AuthContextProvider>
    </CitiesProvider>
  );
}

export default App;
