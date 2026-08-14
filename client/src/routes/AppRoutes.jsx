import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminRoute from "./AdminRoute";
import RestaurantLayout from "../layouts/RestaurantLayout";
import RestaurantRoute from "./RestaurantRoute";
import RiderLayout from "../layouts/RiderLayout";
import RiderRoute from "./RiderRoute";
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
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import AdminFoods from "../pages/AdminFoods";
import AdminRestaurants from "../pages/AdminRestaurants";
import AdminOrders from "../pages/AdminOrders";
import AdminEditFood from "../pages/AdminEditFood";
import AdminAddRestaurant from "../pages/AdminAddRestaurant";
import AdminEditRestaurant from "../pages/AdminEditRestaurant";
import AdminCategories from "../pages/AdminCategories";
import AddEditCategory from "../pages/AddEditCategory";
import AdminCoupons from "../pages/AdminCoupons";
import AddEditCoupon from "../pages/AddEditCoupon";
import RestaurantDashboard from "../pages/RestaurantDashboard";
import RestaurantOrders from "../pages/RestaurantOrders";
import RestaurantFoods from "../pages/RestaurantFoods";
import RestaurantFoodForm from "../pages/RestaurantFoodForm";
import RestaurantProfile from "../pages/RestaurantProfile";
import RiderDashboard from "../pages/RiderDashboard";
import RiderOrders from "../pages/RiderOrders";
import RiderProfile from "../pages/RiderProfile";
import ApplyRole from "../pages/ApplyRole";
import AdminRiderRequests from "../pages/AdminRiderRequests";
import AdminRestaurantRequests from "../pages/AdminRestaurantRequests";

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

      <Route
        path="/apply/:role"
        element={
          <MainLayout>
            <ApplyRole />
          </MainLayout>
        }
      />

      {/* ================= Admin Routes ================= */}

      {/* Visiting /admin lands on the dashboard */}
      <Route
        path="/admin"
        element={<Navigate to="/admin/dashboard" replace />}
      />

      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/foods"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminFoods />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/foods/edit/:id"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminEditFood />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/restaurants"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminRestaurants />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/restaurants/add"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminAddRestaurant />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/restaurants/edit/:id"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminEditRestaurant />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/orders"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminCategories />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/categories/add"
        element={
          <AdminRoute>
            <AdminLayout>
              <AddEditCategory />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/categories/edit/:id"
        element={
          <AdminRoute>
            <AdminLayout>
              <AddEditCategory />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/coupons"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminCoupons />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/coupons/add"
        element={
          <AdminRoute>
            <AdminLayout>
              <AddEditCoupon />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/coupons/edit/:id"
        element={
          <AdminRoute>
            <AdminLayout>
              <AddEditCoupon />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/requests/rider"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminRiderRequests />
            </AdminLayout>
          </AdminRoute>
        }
      />

      <Route
        path="/admin/requests/restaurant"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminRestaurantRequests />
            </AdminLayout>
          </AdminRoute>
        }
      />

      {/* ================= Restaurant Owner Routes ================= */}

      <Route
        path="/restaurant"
        element={<Navigate to="/restaurant/dashboard" replace />}
      />

      <Route
        path="/restaurant/dashboard"
        element={
          <RestaurantRoute>
            <RestaurantLayout>
              <RestaurantDashboard />
            </RestaurantLayout>
          </RestaurantRoute>
        }
      />

      <Route
        path="/restaurant/orders"
        element={
          <RestaurantRoute>
            <RestaurantLayout>
              <RestaurantOrders />
            </RestaurantLayout>
          </RestaurantRoute>
        }
      />

      <Route
        path="/restaurant/foods"
        element={
          <RestaurantRoute>
            <RestaurantLayout>
              <RestaurantFoods />
            </RestaurantLayout>
          </RestaurantRoute>
        }
      />

      <Route
        path="/restaurant/foods/add"
        element={
          <RestaurantRoute>
            <RestaurantLayout>
              <RestaurantFoodForm />
            </RestaurantLayout>
          </RestaurantRoute>
        }
      />

      <Route
        path="/restaurant/foods/edit/:id"
        element={
          <RestaurantRoute>
            <RestaurantLayout>
              <RestaurantFoodForm />
            </RestaurantLayout>
          </RestaurantRoute>
        }
      />

      <Route
        path="/restaurant/profile"
        element={
          <RestaurantRoute>
            <RestaurantLayout>
              <RestaurantProfile />
            </RestaurantLayout>
          </RestaurantRoute>
        }
      />

      {/* ================= Rider Routes ================= */}

      <Route
        path="/rider"
        element={<Navigate to="/rider/dashboard" replace />}
      />

      <Route
        path="/rider/dashboard"
        element={
          <RiderRoute>
            <RiderLayout>
              <RiderDashboard />
            </RiderLayout>
          </RiderRoute>
        }
      />

      <Route
        path="/rider/orders"
        element={
          <RiderRoute>
            <RiderLayout>
              <RiderOrders />
            </RiderLayout>
          </RiderRoute>
        }
      />

      <Route
        path="/rider/profile"
        element={
          <RiderRoute>
            <RiderLayout>
              <RiderProfile />
            </RiderLayout>
          </RiderRoute>
        }
      />

      {/* ================= 404 ================= */}

      <Route
        path="*"
        element={
          <MainLayout>
            <NotFound />
          </MainLayout>
        }
      />

    </Routes>
  );
};

export default AppRoutes;
