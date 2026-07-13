import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
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
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import AdminFoods from "../pages/AdminFoods";
import AdminRestaurants from "../pages/AdminRestaurants";
import AdminOrders from "../pages/AdminOrders";
import AdminAddFood from "../pages/AdminAddFood";
import AdminEditFood from "../pages/AdminEditFood";
import AdminAddRestaurant from "../pages/AdminAddRestaurant";
import AdminEditRestaurant from "../pages/AdminEditRestaurant";
import AdminCategories from "../pages/AdminCategories";
import AddEditCategory from "../pages/AddEditCategory";

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= Public Routes ================= */}

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

      {/* ================= Admin Routes ================= */}

      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <AdminDashboard />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <AdminUsers />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/foods"
        element={
          <AdminLayout>
            <AdminFoods />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/restaurants"
        element={
          <AdminLayout>
            <AdminRestaurants />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/orders"
        element={ 
            <AdminOrders />
        }

      />
      <Route
  path="/admin/foods/add"
  element={<AdminAddFood />}
/>

<Route
  path="/admin/foods/edit/:id"
  element={<AdminEditFood />}
/>

<Route
  path="/admin/restaurants/add"
  element={<AdminAddRestaurant />}
/>

<Route
  path="/admin/restaurants/edit/:id"
  element={<AdminEditRestaurant />}
/>

<Route
  path="/admin/categories"
  element={<AdminCategories />}
/>

<Route
  path="/admin/categories/add"
  element={<AddEditCategory />}
/>

<Route
  path="/admin/categories/edit/:id"
  element={<AddEditCategory />}
/>

    </Routes>
  );
};

export default AppRoutes;