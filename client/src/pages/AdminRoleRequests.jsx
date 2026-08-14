import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaCheck, FaTimes } from "react-icons/fa";

import {
  getAllRoleRequests,
  updateRoleRequestStatus,
} from "../services/roleRequestService";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Approved: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-600",
};

const AdminRoleRequests = ({ roleToFilter }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getAllRoleRequests();
      // Filter by requested role passed as prop
      setRequests((data.requests || []).filter(r => r.requestedRole === roleToFilter));
    } catch (error) {
      console.log(error);
      toast.error("Failed to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [roleToFilter]);

  const handleReview = async (request, status) => {
    const action = status === "Approved" ? "approve" : "reject";

    const confirmAction = window.confirm(
      status === "Approved"
        ? `Approve ${request.user?.name}'s application to become a ${request.requestedRole}?`
        : `Reject ${request.user?.name}'s application to become a ${request.requestedRole}?`
    );

    if (!confirmAction) return;

    try {
      const data = await updateRoleRequestStatus(request._id, status);
      toast.success(data.message);
      fetchRequests();
    } catch (error) {
      toast.error(
        error.response?.data?.message || `Failed to ${action} request.`
      );
    }
  };

  const filteredRequests = requests.filter((request) =>
    filter === "All" ? true : request.status === filter
  );

  const pendingCount = requests.filter((r) => r.status === "Pending").length;

  const renderDetails = (request) => {
    if (request.requestedRole === "rider") {
      return (
        <div className="text-sm">
          <p><strong>Vehicle:</strong> {request.vehicleType}</p>
          <p><strong>Vehicle No:</strong> {request.vehicleNumber}</p>
          <p><strong>License:</strong> {request.licenseNumber}</p>
          <p><strong>Experience:</strong> {request.experienceYears || 0} yrs</p>
        </div>
      );
    }

    return (
      <div className="text-sm">
        <p><strong>Restaurant:</strong> {request.restaurantName}</p>
        <p><strong>Address:</strong> {request.restaurantAddress}</p>
        <p><strong>Phone:</strong> {request.restaurantPhone}</p>
        <p className="text-gray-600 mt-1 max-w-xs line-clamp-2">{request.restaurantDescription}</p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold capitalize">{roleToFilter} Requests</h1>
        <p className="text-gray-500 mt-2">Approve or reject {roleToFilter} applications</p>
      </div>

      <div className="flex gap-2">
        {["All", "Pending", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              filter === tab ? "bg-orange-500 text-white" : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab}
            {tab === "Pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-20 text-xl">Loading Requests...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-500 text-white">
              <tr>
                <th className="p-4 text-left">Applicant</th>
                <th className="p-4 text-left">Details</th>
                <th className="p-4 text-center">Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500">
                    No {roleToFilter} Requests Found
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr key={request._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-semibold">{request.user?.name}</p>
                      <p className="text-sm text-gray-500">{request.user?.email}</p>
                    </td>

                    <td className="p-4">{renderDetails(request)}</td>

                    <td className="p-4 text-center text-sm">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusStyles[request.status]}`}>
                        {request.status}
                      </span>
                    </td>

                    <td className="p-4">
                      {request.status === "Pending" ? (
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleReview(request, "Approved")} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1">
                            <FaCheck /> Approve
                          </button>
                          <button onClick={() => handleReview(request, "Rejected")} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1">
                            <FaTimes /> Reject
                          </button>
                        </div>
                      ) : (
                        <div className="text-center text-sm text-gray-400">
                          {request.adminNote || "—"}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRoleRequests;
