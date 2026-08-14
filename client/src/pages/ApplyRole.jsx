import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaMotorcycle, FaStore } from "react-icons/fa";

import { isLoggedIn, getUser } from "../utils/auth";
import {
  applyForRole,
  getMyRoleRequests,
} from "../services/roleRequestService";

const ApplyRole = () => {
  const { role } = useParams();

  const isRider = role === "rider";
  const isRestaurant = role === "restaurant";

  const user = getUser();

  // When logged out, we still show the form but require login to submit
  const isLoggedOut = !isLoggedIn();

  const [myRequest, setMyRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState(
    isRider
      ? {
          vehicleType: "",
          vehicleNumber: "",
          licenseNumber: "",
          experienceYears: "",
        }
      : {
          ownerName: user?.name || "",
          ownerEmail: user?.email || "",
          ownerPhone: user?.phone || "",
          restaurantName: "",
          restaurantDescription: "",
          restaurantAddress: "",
          restaurantPhone: "",
          restaurantEmail: "",
          cuisineType: "",
          openingTime: "",
          closingTime: "",
          estimatedDeliveryTime: "",
          licenseNumber: "",
        }
  );

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // Load my existing applications for this role
  const fetchMyRequests = async () => {
    try {
      const data = await getMyRoleRequests();

      const existing = (data.requests || []).find(
        (request) => request.requestedRole === role
      );

      setMyRequest(existing || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn()) {
      fetchMyRequests();
    }
  }, []);

  // Invalid role
  if (!isRider && !isRestaurant) {
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { ...formData };

    if (isRestaurant && image) {
      payload.image = image;
    }

    try {
      setSubmitting(true);

      const data = await applyForRole(role, payload);

      toast.success(data.message);

      fetchMyRequests();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Already has a role
  if (user?.role && user?.role !== "customer") {
    return (
      <div className="mx-auto max-w-xl px-6 py-20">
        <div className="rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-10 text-center">
          <p className="font-['Fraunces',serif] text-3xl italic text-[#1D1512]/70">
            You already have an account role.
          </p>

          <p className="mt-3 text-sm text-[#3A2A20]/50">
            Your account is already registered as a{" "}
            <strong>{user.role}</strong>.
          </p>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full border rounded-lg p-3 mt-2";

  const labelClass =
    "font-semibold";

  const heading = isRider ? "Become a Rider" : "Register Your Restaurant";
  const icon = isRider ? FaMotorcycle : FaStore;
  const Icon = icon;
  const applyPath = isRider ? "/apply/rider" : "/apply/restaurant";

  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <div className="rounded-2xl border border-[#EADFC8] bg-[#FFFBF3] p-8 shadow-[0_10px_30px_-12px_rgba(29,21,18,0.15)] sm:p-10">
        {/* header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F0A438]">
            <Icon className="text-3xl text-[#1D1512]" />
          </div>

          <h1 className="mt-5 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#1D1512]">
            {isRider ? (
              <>
                Become a{" "}
                <span className="font-['Fraunces',serif] italic font-normal text-[#D64933]">
                  Rider
                </span>
              </>
            ) : (
              <>
                Register Your{" "}
                <span className="font-['Fraunces',serif] italic font-normal text-[#D64933]">
                  Restaurant
                </span>
              </>
            )}
          </h1>

          <p className="mt-1 text-sm text-[#3A2A20]/55">
            {isRider
              ? "Deliver food and earn with every order you complete"
              : "Bring your kitchen online and start receiving orders"}
          </p>
        </div>

        {/* status banners */}
        {myRequest?.status === "Pending" && (
          <div className="mt-8 rounded-lg border border-[#F0A438]/40 bg-[#F0A438]/10 p-5 text-center">
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#946022]">
              Application Under Review
            </p>

            <p className="mt-2 text-sm text-[#3A2A20]/60">
              You already submitted an application for this role. The admin
              is reviewing it — you'll get the {heading} panel once it's
              approved.
            </p>
          </div>
        )}

        {myRequest?.status === "Approved" && (
          <div className="mt-8 rounded-lg border border-[#3F6B3F]/40 bg-[#3F6B3F]/10 p-5 text-center">
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#2F522F]">
              Application Approved!
            </p>

            <p className="mt-2 text-sm text-[#3A2A20]/60">
              Your role is now active. Log out and log back in to access the{" "}
              {heading} panel.
            </p>
          </div>
        )}

        {myRequest?.status === "Rejected" && (
          <div className="mt-8 rounded-lg border border-[#D64933]/30 bg-[#D64933]/8 p-5 text-center">
            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#B03A24]">
              Application Rejected
            </p>

            <p className="mt-2 text-sm text-[#3A2A20]/60">
              {myRequest.adminNote ||
                "Your application was not approved. You can apply again."}
            </p>
          </div>
        )}

        {/* login required banner */}
        {isLoggedOut && (
          <div className="mt-8 rounded-lg border border-[#F0A438]/40 bg-[#F0A438]/10 p-4 text-center">
            <p className="text-sm text-[#3A2A20]/70">
              You need to log in to submit your{" "}
              {isRider ? "rider" : "restaurant"} application.{" "}
              <Link
                to={`/login?redirect=${applyPath}`}
                className="font-semibold text-[#D64933] hover:underline"
              >
                Login
              </Link>{" "}
              or{" "}
              <Link
                to="/register"
                className="font-semibold text-[#D64933] hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        )}

        {loading && !isLoggedOut ? (
          <p className="mt-8 text-center text-sm text-[#3A2A20]/50">
            Checking your application...
          </p>
        ) : !myRequest || myRequest.status === "Rejected" ? (
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            {isRider ? (
              <>
                <div>
                  <label className={labelClass}>
                    Vehicle Type
                  </label>

                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    required
                    className={inputClass}
                  >
                    <option value="">
                      Select your vehicle
                    </option>
                    <option value="Motorcycle">
                      Motorcycle
                    </option>
                    <option value="Scooter">
                      Scooter
                    </option>
                    <option value="Bicycle">
                      Bicycle
                    </option>
                    <option value="Car">
                      Car
                    </option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Vehicle Number
                  </label>

                  <input
                    type="text"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="e.g. BA 3 PA 1234"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    License Number
                  </label>

                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="e.g. 1234567890"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Years of Experience (optional)
                  </label>

                  <input
                    type="number"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                    min="0"
                    className={inputClass}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      Owner Name
                    </label>

                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleChange}
                      placeholder="e.g. Ram Sharma"
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Owner Phone
                    </label>

                    <input
                      type="text"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                      placeholder="e.g. 9800000000"
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Owner Email
                  </label>

                  <input
                    type="email"
                    name="ownerEmail"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    placeholder="e.g. owner@example.com"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Restaurant Name
                  </label>

                  <input
                    type="text"
                    name="restaurantName"
                    value={formData.restaurantName}
                    onChange={handleChange}
                    placeholder="e.g. Burger House"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Restaurant Description
                  </label>

                  <textarea
                    rows="3"
                    name="restaurantDescription"
                    value={formData.restaurantDescription}
                    onChange={handleChange}
                    placeholder="Tell customers about your food..."
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Restaurant Address
                  </label>

                  <input
                    type="text"
                    name="restaurantAddress"
                    value={formData.restaurantAddress}
                    onChange={handleChange}
                    placeholder="e.g. Thamel, Kathmandu"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Restaurant Phone
                  </label>

                  <input
                    type="text"
                    name="restaurantPhone"
                    value={formData.restaurantPhone}
                    onChange={handleChange}
                    placeholder="e.g. 9800000000"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Restaurant Email
                  </label>

                  <input
                    type="email"
                    name="restaurantEmail"
                    value={formData.restaurantEmail}
                    onChange={handleChange}
                    placeholder="e.g. info@burgerhouse.com"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Cuisine Type
                  </label>

                  <input
                    type="text"
                    name="cuisineType"
                    value={formData.cuisineType}
                    onChange={handleChange}
                    placeholder="e.g. Nepali, Chinese, Fast Food"
                    required
                    className={inputClass}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>
                      Opening Time
                    </label>

                    <input
                      type="time"
                      name="openingTime"
                      value={formData.openingTime}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Closing Time
                    </label>

                    <input
                      type="time"
                      name="closingTime"
                      value={formData.closingTime}
                      onChange={handleChange}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Estimated Delivery Time (minutes)
                  </label>

                  <input
                    type="number"
                    name="estimatedDeliveryTime"
                    value={formData.estimatedDeliveryTime}
                    onChange={handleChange}
                    placeholder="e.g. 30"
                    min="1"
                    required
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    License Number <span className="text-gray-400 font-normal">(optional)</span>
                  </label>

                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="e.g. FSSAI / business license"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Restaurant Image
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImage}
                    className={inputClass}
                  />

                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="mt-4 w-48 h-32 rounded-lg object-cover border"
                    />
                  )}
                </div>
              </>
            )}

            {isLoggedOut ? (
              <Link
                to={`/login?redirect=${applyPath}`}
                className="block w-full rounded-lg bg-[#1D1512] py-3.5 text-center text-lg font-semibold text-[#F7ECD9] transition hover:bg-[#F0A438] hover:text-[#1D1512]"
              >
                Login to Apply
              </Link>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg disabled:opacity-60"
              >
                {submitting
                  ? "Submitting..."
                  : isRider
                  ? "Submit Rider Application"
                  : "Submit Restaurant Application"}
              </button>
            )}

            <p className="text-center text-xs text-[#3A2A20]/50">
              Your application will be reviewed by the admin before your
              role is activated.
            </p>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default ApplyRole;
