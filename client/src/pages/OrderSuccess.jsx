import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-[#FFFBF3] px-6">
      <div className="w-full max-w-xl rounded-2xl border border-[#EADFC8] bg-white p-10 text-center shadow-[0_20px_40px_-16px_rgba(29,21,18,0.25)]">

        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#2E7D4F]/10">
          <span className="text-5xl">🎉</span>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-[#2E7D4F]/25 bg-[#2E7D4F]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#2E7D4F]">
          Order Confirmed
        </span>

        <h1 className="mt-5 font-['Plus_Jakarta_Sans',sans-serif] text-4xl font-bold leading-tight text-[#1D1512]">
          Order placed successfully!
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-[#3A2A20]/65">
          Thank you for ordering with QuickBite.
        </p>

        <p className="mt-2 font-['Fraunces',serif] text-xl italic text-[#D64933]">
          Your food is being prepared.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">

          <Link
            to="/orders"
            className="rounded-lg bg-[#1D1512] px-6 py-3 text-center font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512]"
          >
            View My Orders
          </Link>

          <Link
            to="/"
            className="rounded-lg border border-[#EADFC8] px-6 py-3 text-center font-semibold text-[#1D1512] transition hover:border-[#F0A438] hover:bg-[#F0A438]/10"
          >
            Continue Shopping
          </Link>

        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;