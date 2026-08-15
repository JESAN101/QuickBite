import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ROUTE_TITLES = [
  ["/orders/", "Order Details | QuickBite"],
  ["/orders", "My Orders | QuickBite"],
  ["/food/", "Food Details | QuickBite"],
  ["/restaurant/foods/edit", "Edit Food | QuickBite"],
  ["/restaurant/foods/add", "Add Food | QuickBite"],
  ["/restaurant/foods", "Restaurant Foods | QuickBite"],
  ["/restaurant/orders", "Restaurant Orders | QuickBite"],
  ["/restaurant/profile", "Restaurant Profile | QuickBite"],
  ["/restaurant/dashboard", "Restaurant Dashboard | QuickBite"],
  ["/restaurant/", "Restaurant | QuickBite"],
  ["/restaurant", "Restaurant Dashboard | QuickBite"],
  ["/apply/", "Apply | QuickBite"],
  ["/admin/restaurants/edit", "Edit Restaurant | QuickBite"],
  ["/admin/restaurants/add", "Add Restaurant | QuickBite"],
  ["/admin/restaurants", "Manage Restaurants | QuickBite"],
  ["/admin/foods/edit", "Edit Food | QuickBite"],
  ["/admin/foods", "Manage Foods | QuickBite"],
  ["/admin/categories/edit", "Edit Category | QuickBite"],
  ["/admin/categories/add", "Add Category | QuickBite"],
  ["/admin/categories", "Manage Categories | QuickBite"],
  ["/admin/coupons/edit", "Edit Coupon | QuickBite"],
  ["/admin/coupons/add", "Add Coupon | QuickBite"],
  ["/admin/coupons", "Manage Coupons | QuickBite"],
  ["/admin/requests/rider", "Rider Requests | QuickBite"],
  ["/admin/requests/restaurant", "Restaurant Requests | QuickBite"],
  ["/admin/users", "Manage Users | QuickBite"],
  ["/admin/orders", "Manage Orders | QuickBite"],
  ["/admin/dashboard", "Admin Dashboard | QuickBite"],
  ["/admin", "Admin Dashboard | QuickBite"],
  ["/rider/orders", "Rider Orders | QuickBite"],
  ["/rider/profile", "Rider Profile | QuickBite"],
  ["/rider/dashboard", "Rider Dashboard | QuickBite"],
  ["/rider", "Rider Dashboard | QuickBite"],
  ["/checkout", "Checkout | QuickBite"],
  ["/order-success", "Order Confirmed | QuickBite"],
  ["/favorites", "Favorites | QuickBite"],
  ["/profile", "Profile | QuickBite"],
  ["/register", "Register | QuickBite"],
  ["/login", "Login | QuickBite"],
  ["/cart", "My Cart | QuickBite"],
  ["/", "QuickBite | Order Food Online"],
];

const NOT_FOUND_TITLE = "Page Not Found | QuickBite";

const PageTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const match = ROUTE_TITLES.find(
      ([path]) => pathname === path || pathname.startsWith(`${path}/`)
    );

    document.title = match ? match[1] : NOT_FOUND_TITLE;
  }, [pathname]);

  return null;
};

export default PageTitle;
