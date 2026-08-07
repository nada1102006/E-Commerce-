import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  LogOut,
  Check,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Heart,
  X,
  Building,
  Globe,
  ArrowRight,
  KeyRound,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");

  const [user, setUser] = useState({
    username: localStorage.getItem("username") || "Customer",
    email: localStorage.getItem("email") || "customer@gmail.com",
    phone: localStorage.getItem("phone") || "+20 101 393 372",
    role: "Verified Customer",
    avatar: localStorage.getItem("avatar") || "",
  });

  const [formData, setFormData] = useState({
    username: user.username,
    phone: user.phone,
    avatar: user.avatar,
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      country: "Egypt",
      city: "Cairo",
      street: "El-Tahrir Street",
      building: "Building 12, Apt 4",
      postalCode: "11511",
      isDefault: true,
    },
  ]);

  const [addressData, setAddressData] = useState({
    country: "",
    city: "",
    street: "",
    building: "",
    postalCode: "",
  });

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [passwordEmail, setPasswordEmail] = useState(user.email);
  const [passwordStep, setPasswordStep] = useState("email");
  const [passwordData, setPasswordData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    try {
      const storedUserStr = localStorage.getItem("user");
      if (storedUserStr) {
        const storedUser = JSON.parse(storedUserStr);
        setUser((prev) => ({
          ...prev,
          username: storedUser.username || storedUser.name || prev.username,
          email: storedUser.email || prev.email,
          phone: storedUser.phone || prev.phone,
          avatar: storedUser.avatar || prev.avatar,
        }));
        setFormData({
          username: storedUser.username || storedUser.name || user.username,
          phone: storedUser.phone || user.phone,
          avatar: storedUser.avatar || user.avatar,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);

    setTimeout(() => {
      setUser((prev) => ({ ...prev, ...formData }));
      localStorage.setItem("username", formData.username);
      if (formData.avatar) localStorage.setItem("avatar", formData.avatar);
      setSaving(false);
      toast.success("Profile details updated successfully!");
    }, 600);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addressData.country || !addressData.city || !addressData.street) {
      toast.error("Please fill in country, city, and street address!");
      return;
    }

    const newAddr = {
      id: Date.now(),
      ...addressData,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setShowAddAddress(false);
    setAddressData({
      country: "",
      city: "",
      street: "",
      building: "",
      postalCode: "",
    });
    toast.success("New shipping address added successfully!");
  };

  const handleSendOtp = () => {
    if (!passwordEmail.trim()) {
      toast.error("Please enter your registered email address");
      return;
    }
    setTimeout(() => {
      toast.success("OTP sent to your email!");
      setPasswordStep("reset");
    }, 500);
  };

  const handleResetPassword = () => {
    if (!passwordData.otp || !passwordData.newPassword) {
      toast.error("Please enter the OTP code and new password");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setTimeout(() => {
      toast.success("Password updated successfully!");
      setIsPasswordOpen(false);
      setPasswordStep("email");
      setPasswordData({ otp: "", newPassword: "", confirmPassword: "" });
    }, 600);
  };

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("token");
    localStorage.removeItem("isLogin");
    localStorage.removeItem("username");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    toast.info("Logged out successfully");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#070B1A] flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600/20 border-t-indigo-600"></div>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#070B1A] pt-14 sm:pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Manage your personal information, address book, and security preferences.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" />
              {user.role}
            </span>
          </div>
        </div>

        {/* Main 2-Column Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* User Overview Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 shadow-sm text-center">
              <div className="mx-auto mb-4 flex justify-center">
                <FaUserCircle className="h-24 w-24 text-slate-300 dark:text-slate-600" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">
                {user.username}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {user.email}
              </p>

              <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2.5 text-left text-xs sm:text-sm">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Phone className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>{user.phone}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 dark:bg-red-950/40 hover:bg-red-100 dark:hover:bg-red-900/60 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 py-2.5 px-4 text-xs font-bold transition active:scale-95"
              >
                <LogOut className="w-4 h-4" /> Logout Account
              </button>
            </div>

            {/* Sidebar Navigation Card */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-3 shadow-sm space-y-1">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeTab === "profile"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4" /> Personal Information
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeTab === "addresses"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4" /> Shipping Addresses
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("security")}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  activeTab === "security"
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4" /> Security & Password
                </div>
                <ArrowRight className="w-4 h-4 opacity-70" />
              </button>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1">
                <Link
                  to="/orders"
                  className="w-full flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-4 h-4 text-indigo-500" /> My Orders
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-70" />
                </Link>

                <Link
                  to="/wishlist"
                  className="w-full flex items-center justify-between p-3 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <Heart className="w-4 h-4 text-pink-500" /> My Wishlist
                  </div>
                  <ArrowRight className="w-4 h-4 opacity-70" />
                </Link>
              </div>
            </div>

          </div>

          {/* Right Content Panel Column */}
          <div className="lg:col-span-8">
            
            {/* Tab 1: Personal Information Form */}
            {activeTab === "profile" && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Personal Information</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Update your account name, contact phone, and avatar image.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Username / Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-sm font-medium transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Phone number"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20 text-sm font-medium transition"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                      Email Address (Read Only)
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800/30 text-slate-500 dark:text-slate-400 text-sm font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>



                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-60"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Tab 2: Shipping Addresses Panel */}
            {activeTab === "addresses" && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Shipping Addresses</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Manage saved delivery addresses for faster order checkout.</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAddAddress(!showAddAddress)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs font-bold transition shadow active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{showAddAddress ? "Cancel" : "Add Address"}</span>
                  </button>
                </div>

                {/* Add Address Form */}
                {showAddAddress && (
                  <form onSubmit={handleSaveAddress} className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Add New Address</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="relative">
                        <Globe className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="country"
                          value={addressData.country}
                          onChange={handleAddressChange}
                          placeholder="Country (e.g. Egypt)"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium outline-none focus:border-indigo-600"
                        />
                      </div>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          name="city"
                          value={addressData.city}
                          onChange={handleAddressChange}
                          placeholder="City (e.g. Cairo)"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium outline-none focus:border-indigo-600"
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <input
                        type="text"
                        name="street"
                        value={addressData.street}
                        onChange={handleAddressChange}
                        placeholder="Street Address"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium outline-none focus:border-indigo-600"
                      />
                      <input
                        type="text"
                        name="building"
                        value={addressData.building}
                        onChange={handleAddressChange}
                        placeholder="Building / Apt Number"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium outline-none focus:border-indigo-600"
                      />
                    </div>
                    <input
                      type="text"
                      name="postalCode"
                      value={addressData.postalCode}
                      onChange={handleAddressChange}
                      placeholder="Postal Code (Optional)"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium outline-none focus:border-indigo-600"
                    />
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddAddress(false)}
                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                {/* Addresses List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-indigo-500" /> {addr.city}, {addr.country}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {addr.street}{addr.building && `, ${addr.building}`}
                      </p>
                      {addr.postalCode && (
                        <p className="text-[11px] text-slate-400 pt-1">Postal Code: {addr.postalCode}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Security & Password Panel */}
            {activeTab === "security" && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-6 sm:p-8 shadow-sm space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="p-3 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security & Password</h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Update your password via OTP email verification.</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-purple-500/20 bg-purple-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-purple-500" /> Account Password
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      We recommend updating your password periodically for extra security.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordEmail(user?.email || "");
                      setPasswordStep("email");
                      setPasswordData({ otp: "", newPassword: "", confirmPassword: "" });
                      setIsPasswordOpen(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-bold transition shadow active:scale-95 shrink-0"
                  >
                    <Lock className="w-4 h-4" /> Change Password
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Change Password Modal */}
        {isPasswordOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-fade-in"
            onClick={() => setIsPasswordOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Change Password
                </h2>
                <button
                  type="button"
                  onClick={() => setIsPasswordOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-5">
                {passwordStep === "email"
                  ? "We'll send an OTP code to your registered email to verify your identity."
                  : "Enter the OTP code sent to your email and choose a strong new password."}
              </p>

              {passwordStep === "email" ? (
                <div className="relative mb-5">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={passwordEmail}
                    onChange={(e) => setPasswordEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-600 text-sm font-medium"
                  />
                </div>
              ) : (
                <div className="space-y-3 mb-5">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={passwordData.otp}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, otp: e.target.value }))}
                    placeholder="OTP Code"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-600 text-sm font-medium"
                  />
                  <input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="New Password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-600 text-sm font-medium"
                  />
                  <input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm New Password"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-indigo-600 text-sm font-medium"
                  />
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 py-2.5 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={passwordStep === "email" ? handleSendOtp : handleResetPassword}
                  className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-sm font-semibold shadow-md transition-all"
                >
                  {passwordStep === "email" ? "Send OTP" : "Save Password"}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
