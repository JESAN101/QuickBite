import RestaurantSidebar from "../components/restaurant/RestaurantSidebar";

const RestaurantLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <RestaurantSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default RestaurantLayout;
