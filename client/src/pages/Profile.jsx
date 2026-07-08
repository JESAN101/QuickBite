import { useEffect, useState } from "react";
import { getProfile } from "../services/authService";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getProfile();
      setUser(data.user);
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">

      <div className="bg-white shadow-xl rounded-xl p-8">

        <div className="flex items-center gap-5 mb-8">

          <div className="w-20 h-20 rounded-full bg-orange-500 text-white flex items-center justify-center text-3xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h1 className="text-3xl font-bold">
              {user.name}
            </h1>

            <p className="text-gray-500">
              {user.role}
            </p>
          </div>

        </div>

        <hr className="mb-8" />

        <div className="space-y-6">

          <div>
            <label className="font-semibold">
              Email
            </label>

            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
              {user.email}
            </div>
          </div>

          <div>
            <label className="font-semibold">
              Phone
            </label>

            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
              {user.phone || "Not Added"}
            </div>
          </div>

          <div>
            <label className="font-semibold">
              Address
            </label>

            <div className="mt-2 border rounded-lg p-3 bg-gray-50">
              {user.address || "Not Added"}
            </div>
          </div>

        </div>

        <button
          className="mt-10 bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Edit Profile
        </button>

      </div>

    </div>
  );
};

export default Profile;