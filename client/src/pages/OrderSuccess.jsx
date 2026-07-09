import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-xl w-full">

        <div className="text-7xl mb-5">
          🎉
        </div>

        <h1 className="text-4xl font-bold text-green-600">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mt-5 text-lg">
          Thank you for ordering with QuickBite.
        </p>

        <p className="text-gray-500 mt-2">
          Your food is being prepared.
        </p>

        <div className="mt-10 flex gap-4 justify-center">

          <Link
            to="/orders"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            View My Orders
          </Link>

          <Link
            to="/"
            className="border border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-3 rounded-lg font-semibold"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;