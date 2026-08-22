import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";
import AdminRoute from "./AdminRoute";
import RestaurantLayout from "../layouts/RestaurantLayout";
import RestaurantRoute from "./RestaurantRoute";
import RiderLayout from "../layouts/RiderLayout";
import RiderRoute from "./RiderRoute";
import Loader from "../components/Loader";
import ChunkErrorBoundary from "./ChunkErrorBoundary";

const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Profile = lazy(() => import("../pages/Profile"));
const Cart = lazy(() => import("../pages/Cart"));
const Orders = lazy(() => import("../pages/Orders"));
const OrderDetails = lazy(() => import("../pages/OrderDetails"));
const Checkout = lazy(() => import("../pages/Checkout"));
const Restaurant = lazy(() => import("../pages/Restaurant"));
const FoodDetails = lazy(() => import("../pages/FoodDetails"));
const OrderSuccess = lazy(() => import("../pages/OrderSuccess"));
const Favorites = lazy(() => import("../pages/Favorites"));
const NotFound = lazy(() => import("../pages/NotFound"));
const ApplyRole = lazy(() => import("../pages/ApplyRole"));

// Admin — only loaded when an admin navigates to /admin/**
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AdminUsers = lazy(() => import("../pages/AdminUsers"));
const AdminFoods = lazy(() => import("../pages/AdminFoods"));
const AdminRestaurants = lazy(() => import("../pages/AdminRestaurants"));
const AdminOrders = lazy(() => import("../pages/AdminOrders"));
const AdminEditFood = lazy(() => import("../pages/AdminEditFood"));
const AdminAddRestaurant = lazy(() => import("../pages/AdminAddRestaurant"));
const AdminEditRestaurant = lazy(() => import("../pages/AdminEditRestaurant"));
const AdminCategories = lazy(() => import("../pages/AdminCategories"));
const AddEditCategory = lazy(() => import("../pages/AddEditCategory"));
const AdminCoupons = lazy(() => import("../pages/AdminCoupons"));
const AddEditCoupon = lazy(() => import("../pages/AddEditCoupon"));
const AdminRiderRequests = lazy(() => import("../pages/AdminRiderRequests"));
const AdminRestaurantRequests = lazy(
  () => import("../pages/AdminRestaurantRequests"),
);

// Restaurant owner
const RestaurantDashboard = lazy(() => import("../pages/RestaurantDashboard"));
const RestaurantOrders = lazy(() => import("../pages/RestaurantOrders"));
const RestaurantFoods = lazy(() => import("../pages/RestaurantFoods"));
const RestaurantFoodForm = lazy(() => import("../pages/RestaurantFoodForm"));
const RestaurantProfile = lazy(() => import("../pages/RestaurantProfile"));

// Rider
const RiderDashboard = lazy(() => import("../pages/RiderDashboard"));
const RiderOrders = lazy(() => import("../pages/RiderOrders"));
const RiderProfile = lazy(() => import("../pages/RiderProfile"));

const SuspenseWrapper = ({ children }) => (
  <Suspense
    fallback={
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader label="Loading page..." />
      </div>
    }
  >
    {children}
  </Suspense>
);

const AppRoutes = () => {
  return (
    <ChunkErrorBoundary>
      <SuspenseWrapper>
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
            path="/orders/:id"
            element={
              <MainLayout>
                <OrderDetails />
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
      </SuspenseWrapper>
    </ChunkErrorBoundary>
  );
};

export default AppRoutes;
