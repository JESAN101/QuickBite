// =============================================
// Opening hours helpers
// Supports "7:00 AM", "19:00", "07:00", "7pm", ...
// =============================================

const parseTime = (value) => {
  if (!value || typeof value !== "string") return null;

  const str = value.trim();
  if (!str) return null;

  // 12-hour clock with AM/PM
  const match12 = str.match(
    /^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i
  );
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = match12[2]
      ? parseInt(match12[2], 10)
      : 0;
    const meridiem = match12[3].toLowerCase();

    if (hours > 12) return null;

    if (meridiem === "pm" && hours < 12) hours += 12;
    if (meridiem === "am" && hours === 12) hours = 0;

    return hours * 60 + minutes;
  }

  // 24-hour clock "19:00" or "19"
  const match24 = str.match(/^(\d{1,2})(?::(\d{2}))?$/);
  if (match24) {
    const hours = parseInt(match24[1], 10);
    const minutes = match24[2]
      ? parseInt(match24[2], 10)
      : 0;

    if (hours > 23 || minutes > 59) return null;

    return hours * 60 + minutes;
  }

  return null;
};

// Is the restaurant open RIGHT NOW?
// - The admin/owner "isOpen" toggle always wins.
// - Otherwise the current time is checked against
//   openingTime/closingTime (handles overnight hours).
// - If no hours are set, falls back to the isOpen flag.
const isRestaurantOpenNow = (restaurant) => {
  if (!restaurant) return false;

  if (restaurant.isOpen === false) return false;

  const open = parseTime(restaurant.openingTime);
  const close = parseTime(restaurant.closingTime);

  if (open === null || close === null) {
    return restaurant.isOpen !== false;
  }

  const now = new Date();
  const nowMinutes =
    now.getHours() * 60 + now.getMinutes();

  // Standard daytime window
  if (open < close) {
    return nowMinutes >= open && nowMinutes < close;
  }

  // Overnight window (e.g. 18:00 → 02:00)
  return nowMinutes >= open || nowMinutes < close;
};

const formatMinutes = (minutes) => {
  const hours24 = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${hours12}:${String(mins).padStart(2, "0")} ${period}`;
};

// Friendly "7:00 AM – 9:00 PM" string ("" if unset)
const formatHours = (restaurant) => {
  if (!restaurant) return "";

  const open = parseTime(restaurant.openingTime);
  const close = parseTime(restaurant.closingTime);

  if (open === null || close === null) return "";

  return `${formatMinutes(open)} – ${formatMinutes(close)}`;
};

module.exports = {
  parseTime,
  isRestaurantOpenNow,
  formatHours,
};
