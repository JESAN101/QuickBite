import { Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Cart from "../pages/Cart";
import Orders from "../pages/Orders";
import Checkout from "../pages/Checkout";
import Restaurant from "../pages/Restaurant";
import FoodDetails from "../pages/FoodDetails";
import OrderSuccess from "../pages/OrderSuccess";
import Favorites from "../pages/Favorites";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <Home />
          </MainLayout>
        }
      />

      <Route
  path="/restaurant/:id"
  element={
    <MainLayout>
      <Restaurant />
    </MainLayout>
  }
/>

<Route
  path="/food/:id"
  element={
    <MainLayout>
      <FoodDetails />
    </MainLayout>
  }
/>

      <Route
        path="/login"
        element={
          <MainLayout>
            <Login />
          </MainLayout>
        }
      />

      <Route
        path="/register"
        element={
          <MainLayout>
            <Register />
          </MainLayout>
        }
      />

      <Route
        path="/profile"
        element={
          <MainLayout>
            <Profile />
          </MainLayout>
        }
      />

      <Route
        path="/cart"
        element={
          <MainLayout>
            <Cart />
          </MainLayout>
        }
      />

      <Route
        path="/orders"
        element={
          <MainLayout>
            <Orders />
          </MainLayout>
        }
      />

      <Route
        path="/checkout"
        element={
          <MainLayout>
            <Checkout />
          </MainLayout>
        }
      />

      <Route
  path="/order-success"
  element={
    <MainLayout>
      <OrderSuccess />
    </MainLayout>
  }
/>

<Route
  path="/favorites"
  element={
    <MainLayout>
      <Favorites />
    </MainLayout>
  }
/>
    </Routes>

    
  );
};

export default AppRoutes;