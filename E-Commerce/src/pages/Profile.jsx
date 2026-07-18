import { useEffect, useState } from "react";
import { FaUserCircle, FaMapMarkerAlt, FaLock } from "react-icons/fa";
import api from "../api/api";

const profileEndpoints = ["/user/profile", "/users/me", "/profile", "/me"];
const updateEndpoints = ["/user/profile", "/users/me", "/profile", "/me"];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    avatar: "",
  });
  const [addressData, setAddressData] = useState({
    country: "",
    city: "",
    street: "",
    building: "",
    postalCode: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const getErrorMessage = (error) => {
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return "Something went wrong";
  };

  const requestWithFallback = async (method, endpoints, data = null) => {
    let lastError = null;

    for (const endpoint of endpoints) {
      try {
        return await api({
          method,
          url: endpoint,
          data,
        });
      } catch (error) {
        const status = error?.response?.status;
        lastError = error;

        if (status === 401) {
          throw error;
        }

        if (status !== 404) {
          throw error;
        }
      }
    }

    throw lastError;
  };

  const fetchProfile = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await requestWithFallback("get", profileEndpoints);
      const profileData = response?.data?.user || response?.data;

      if (profileData) {
        setUser(profileData);
        setFormData({
          username: profileData.username || "",
          phone: profileData.phone || "",
          avatar: profileData.avatar || "",
        });

        const firstAddress = Array.isArray(profileData.addresses) && profileData.addresses.length > 0
          ? profileData.addresses[0]
          : {};

        setAddressData({
          country: firstAddress?.country || "",
          city: firstAddress?.city || "",
          street: firstAddress?.street || "",
          building: firstAddress?.building || "",
          postalCode: firstAddress?.postalCode || "",
        });
      } else {
        throw new Error("No profile data returned from the server");
      }
    } catch (error) {
      const msg = getErrorMessage(error);
      setMessage({ type: "error", text: msg });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await requestWithFallback("put", updateEndpoints, formData);
      const updatedUser = response?.data?.user || response?.data;

      if (updatedUser) {
        setUser(updatedUser);
        setMessage({
          type: "success",
          text: response?.data?.message || "Profile updated successfully",
        });
      } else {
        setMessage({
          type: "success",
          text: response?.data?.message || "Profile updated successfully",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-4 text-center">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username || "User avatar"}
                  className="h-24 w-24 rounded-full border-4 border-violet-600 object-cover"
                />
              ) : (
                <FaUserCircle className="h-24 w-24 text-slate-400" />
              )}
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Customer</p>
                <h1 className="text-2xl font-semibold text-slate-900">{user?.username || "Customer"}</h1>
                <p className="mt-1 text-sm text-slate-500">{user?.role || "Customer"}</p>
              </div>
            </div>

            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 px-4 py-4">
                <p className="text-slate-500">Email</p>
                <p className="mt-2 font-medium text-slate-800">{user?.email || "customer@gmail.com"}</p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-4">
                <p className="text-slate-500">Phone</p>
                <p className="mt-2 font-medium text-slate-800">{user?.phone || "101393372"}</p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={fetchProfile}
                className="rounded-full border border-violet-600 bg-white px-5 py-2 text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

       

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Addresses</h2>
              <p className="text-sm text-slate-500">Add or edit your main shipping address.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="country"
                value={addressData.country}
                onChange={handleAddressChange}
                placeholder="Country"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              />
              <input
                type="text"
                name="city"
                value={addressData.city}
                onChange={handleAddressChange}
                placeholder="City"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="text"
                name="street"
                value={addressData.street}
                onChange={handleAddressChange}
                placeholder="Street"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              />
              <input
                type="text"
                name="building"
                value={addressData.building}
                onChange={handleAddressChange}
                placeholder="Building"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              />
            </div>
            <input
              type="text"
              name="postalCode"
              value={addressData.postalCode}
              onChange={handleAddressChange}
              placeholder="Postal code"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
            />
          </div>

          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            + Add Address
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <FaLock />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Change Password</h2>
              <p className="text-sm text-slate-500">Update your account password for extra security.</p>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-2xl border border-violet-600 bg-white px-5 py-3 text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
          >
            Change Password
          </button>
        </div>

        <button
          type="button"
          className="w-full rounded-3xl bg-red-600 px-4 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </div>
  );

}