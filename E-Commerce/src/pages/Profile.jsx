import { useEffect, useState } from "react";
import { FaUserCircle, FaMapMarkerAlt, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

const profileEndpoints = ["/user/profile", "/users/me", "/profile", "/me"];
const updateEndpoints = ["/user/profile", "/users/me", "/profile", "/me"];
const otpEndpoints = [
  "/auth/forgot-password",
  "/forgot-password",
  "/users/forgot-password",
];
const resetPasswordEndpoints = [
  "/auth/reset-password",
  "/reset-password",
  "/users/reset-password",
];

export default function Profile() {
  const navigate = useNavigate();
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
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordEmail, setPasswordEmail] = useState("");
  const [passwordStep, setPasswordStep] = useState("email");
  const [passwordData, setPasswordData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [sendingOtp, setSendingOtp] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
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

        const firstAddress =
          Array.isArray(profileData.addresses) &&
          profileData.addresses.length > 0
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

  const handleCancel = () => {
    if (user) {
      setFormData({
        username: user.username || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });

      const firstAddress =
        Array.isArray(user.addresses) && user.addresses.length > 0
          ? user.addresses[0]
          : {};

      setAddressData({
        country: firstAddress?.country || "",
        city: firstAddress?.city || "",
        street: firstAddress?.street || "",
        building: firstAddress?.building || "",
        postalCode: firstAddress?.postalCode || "",
      });
    }

    setIsEditing(false);
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await requestWithFallback("put", updateEndpoints, {
        ...formData,
        addresses: [addressData],
      });
      const updatedUser = response?.data?.user || response?.data;

      if (updatedUser) {
        setUser(updatedUser);
        setFormData({
          username: updatedUser.username || "",
          phone: updatedUser.phone || "",
          avatar: updatedUser.avatar || "",
        });

        const firstAddress =
          Array.isArray(updatedUser.addresses) &&
          updatedUser.addresses.length > 0
            ? updatedUser.addresses[0]
            : {};

        setAddressData({
          country: firstAddress?.country || "",
          city: firstAddress?.city || "",
          street: firstAddress?.street || "",
          building: firstAddress?.building || "",
          postalCode: firstAddress?.postalCode || "",
        });

        setMessage({
          type: "success",
          text: response?.data?.message || "Profile updated successfully",
        });
        setIsEditing(false);
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

  const handleSaveAddress = async () => {
    setSavingAddress(true);
    setMessage({ type: "", text: "" });

    try {
      const existingAddress = Array.isArray(user?.addresses)
        ? user.addresses[0]
        : null;
      const address = existingAddress?._id
        ? { ...existingAddress, ...addressData }
        : addressData;
      const response = await requestWithFallback("put", updateEndpoints, {
        username: formData.username,
        phone: formData.phone,
        avatar: formData.avatar,
        addresses: [address],
      });
      const updatedUser = response?.data?.user || response?.data;

      if (updatedUser && typeof updatedUser === "object") {
        setUser(updatedUser);
      }
      setMessage({
        type: "success",
        text: response?.data?.message || "Address saved successfully",
      });
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSendOtp = async () => {
    const email = passwordEmail.trim();
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" });
      return;
    }

    setSendingOtp(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await requestWithFallback("post", otpEndpoints, {
        email,
      });
      setMessage({
        type: "success",
        text: response?.data?.message || "OTP sent to your email",
      });
      setPasswordStep("reset");
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResetPassword = async () => {
    if (!passwordData.otp || !passwordData.newPassword) {
      setMessage({
        type: "error",
        text: "Please enter the OTP and your new password",
      });
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setResettingPassword(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await requestWithFallback(
        "post",
        resetPasswordEndpoints,
        {
          email: passwordEmail.trim(),
          otp: passwordData.otp,
          code: passwordData.otp,
          newPassword: passwordData.newPassword,
          password: passwordData.newPassword,
        },
      );
      setMessage({
        type: "success",
        text: response?.data?.message || "Password changed successfully",
      });
      setIsPasswordOpen(false);
      setPasswordStep("email");
      setPasswordData({ otp: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setMessage({ type: "error", text: getErrorMessage(error) });
    } finally {
      setResettingPassword(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6">
        {message.text && (
          <div
            role="alert"
            className={`rounded-2xl px-4 py-3 text-sm font-medium ${
              message.type === "error"
                ? "bg-red-50 text-red-700"
                : "bg-emerald-50 text-emerald-700"
            }`}
          >
            {message.text}
          </div>
        )}
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
                <p className="text-sm uppercase tracking-[0.3em] text-slate-500">
                  Customer
                </p>
                <h1 className="text-2xl font-semibold text-slate-900">
                  {user?.username || "Customer"}
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {user?.role || "Customer"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 text-sm md:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 px-4 py-4">
                <p className="text-slate-500">Email</p>
                <p className="mt-2 font-medium text-slate-800">
                  {user?.email || "customer@gmail.com"}
                </p>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-4">
                <p className="text-slate-500">Phone</p>
                <p className="mt-2 font-medium text-slate-800">
                  {user?.phone || "101393372"}
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(true);
                  setMessage({ type: "", text: "" });
                }}
                className="rounded-full border border-violet-600 bg-white px-5 py-2 text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
              >
                Edit Profile
              </button>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-slate-900">
              Edit Profile
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Update your profile and address information.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                />
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
                />
              </div>

              <input
                type="text"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="Avatar URL"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none"
              />

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

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <FaMapMarkerAlt />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Addresses
              </h2>
              <p className="text-sm text-slate-500">
                Add or edit your main shipping address.
              </p>
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
            onClick={handleSaveAddress}
            disabled={savingAddress}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
          >
            {savingAddress ? "Saving..." : "+ Add Address"}
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <FaLock />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Change Password
              </h2>
              <p className="text-sm text-slate-500">
                Update your account password for extra security.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setPasswordEmail(user?.email || "");
              setPasswordStep("email");
              setPasswordData({
                otp: "",
                newPassword: "",
                confirmPassword: "",
              });
              setIsPasswordOpen(true);
              setMessage({ type: "", text: "" });
            }}
            className="mt-5 inline-flex items-center justify-center rounded-2xl border border-violet-600 bg-white px-5 py-3 text-sm font-semibold text-violet-600 transition hover:bg-violet-50"
          >
            Change Password
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full rounded-3xl bg-red-600 px-4 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          Logout
        </button>

        {isPasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
              <h2 className="text-xl font-semibold text-slate-900">
                Change Password
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {passwordStep === "email"
                  ? "We'll send an OTP to your email to verify your identity."
                  : "Enter the OTP we sent and choose a new password."}
              </p>
              {passwordStep === "email" ? (
                <input
                  type="email"
                  value={passwordEmail}
                  onChange={(e) => setPasswordEmail(e.target.value)}
                  placeholder="Email address"
                  className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600"
                />
              ) : (
                <div className="mt-5 space-y-3">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={passwordData.otp}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        otp: e.target.value,
                      }))
                    }
                    placeholder="OTP code"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600"
                  />
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="New password"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600"
                  />
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm new password"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-violet-600"
                  />
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={
                    passwordStep === "email"
                      ? handleSendOtp
                      : handleResetPassword
                  }
                  disabled={sendingOtp || resettingPassword}
                  className="rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {passwordStep === "email"
                    ? sendingOtp
                      ? "Sending..."
                      : "Send OTP"
                    : resettingPassword
                      ? "Changing..."
                      : "Change Password"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPasswordOpen(false);
                    setPasswordStep("email");
                  }}
                  className="rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
