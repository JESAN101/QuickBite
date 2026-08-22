// Shared order-status styling so every screen renders statuses identically.

export const ORDER_STATUSES = [
  "Pending",
  "Preparing",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

// Tailwind badge classes (light backgrounds) used in tables/cards.
export const ORDER_STATUS_BADGE = {
  Pending: "bg-yellow-100 text-yellow-700",
  Preparing: "bg-blue-100 text-blue-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-600",
};

export const getStatusBadgeClass = (status, fallback = "bg-gray-100 text-gray-600") =>
  ORDER_STATUS_BADGE[status] || fallback;

// Solid fills with white text (used as <select> backgrounds in admin tables).
export const ORDER_STATUS_SOLID = {
  Pending: "bg-yellow-500",
  Preparing: "bg-blue-500",
  "Out for Delivery": "bg-purple-500",
  Delivered: "bg-green-500",
  Cancelled: "bg-red-500",
};

export const getStatusSolidClass = (status, fallback = "bg-gray-500") =>
  ORDER_STATUS_SOLID[status] || fallback;

// Badge classes plus a matching border color.
export const ORDER_STATUS_BADGE_BORDERED = {
  Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Preparing: "bg-blue-100 text-blue-700 border-blue-200",
  "Out for Delivery": "bg-purple-100 text-purple-700 border-purple-200",
  Delivered: "bg-green-100 text-green-700 border-green-200",
  Cancelled: "bg-red-100 text-red-600 border-red-200",
};

export const getStatusBorderedClass = (
  status,
  fallback = "bg-gray-100 text-gray-600"
) => ORDER_STATUS_BADGE_BORDERED[status] || fallback;

// Storefront-themed badges (cream/amber palette).
export const ORDER_STATUS_BADGE_STOREFRONT = {
  Pending: "bg-[#F0A438]/15 text-[#946022]",
  Preparing: "bg-[#D64933]/12 text-[#B03A24]",
  "Out for Delivery": "bg-[#3B6E8F]/12 text-[#2C5670]",
  Delivered: "bg-[#3F6B3F]/15 text-[#2F522F]",
  Cancelled: "bg-[#1D1512]/10 text-[#1D1512]/60",
};

export const getStatusStorefrontClass = (
  status,
  fallback = "bg-[#EADFC8] text-[#1D1512]"
) => ORDER_STATUS_BADGE_STOREFRONT[status] || fallback;

// Hex colors for Chart.js doughnut charts.
export const ORDER_STATUS_CHART_COLORS = {
  Pending: "#eab308",
  Preparing: "#06b6d4",
  "Out for Delivery": "#a855f7",
  Delivered: "#15803d",
  Cancelled: "#ef4444",
};

export const getOrderStatusChartColor = (status, fallback = "#6b7280") =>
  ORDER_STATUS_CHART_COLORS[status] || fallback;
