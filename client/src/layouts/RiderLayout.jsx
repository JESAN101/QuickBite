import RiderSidebar from "../components/rider/RiderSidebar";

const RiderLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <RiderSidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default RiderLayout;
