// RestaurantCard.jsx
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";

const RestaurantCard = ({ restaurant }) => {
  return (
    <Link
      to={`/restaurant/${restaurant._id}`}
      className="group block overflow-hidden rounded-2xl border border-[#EADFC8] bg-white shadow-[0_8px_20px_-10px_rgba(29,21,18,0.15)] transition hover:-translate-y-1 hover:shadow-[0_18px_34px_-12px_rgba(29,21,18,0.25)]"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={`http://localhost:5000/uploads/${restaurant.image}`}
          alt={restaurant.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span
          className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
            restaurant.isOpen
              ? "bg-[#3F6B3F]/90 text-[#F7ECD9]"
              : "bg-[#1D1512]/70 text-[#F7ECD9]/80"
          }`}
        >
          {restaurant.isOpen ? "Open now" : "Closed"}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#1D1512]">
          {restaurant.name}
        </h3>

        <p className="mt-1.5 line-clamp-2 text-sm text-[#3A2A20]/60">
          {restaurant.description}
        </p>

        <div className="mt-4 space-y-1.5 border-t border-[#EADFC8] pt-3">
          <p className="flex items-center gap-2 text-sm text-[#3A2A20]/70">
            <FaMapMarkerAlt className="shrink-0 text-[#D64933]" />
            <span className="truncate">{restaurant.address}</span>
          </p>
          <p className="flex items-center gap-2 text-sm text-[#3A2A20]/70">
            <FaPhoneAlt className="shrink-0 text-[#D64933]" />
            {restaurant.phone}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;