import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../config/AxiosInstance"; // <-- adjust import path

const Login = ({ setUser }) => {
  const navigate = useNavigate();

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    if (!mobile || mobile.length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/users/send-otp-login", {
        mobile: Number(mobile),
      });

      const { success, message } = response.data;

      if (success) {
        toast.success(message);
        setOtpSent(true);
      } else {
        toast.error("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Send OTP Error:", error);
      toast.error(
        error.response?.data?.message || "Error sending OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post("/users/verify-otp-login", {
        mobile: Number(mobile),
        otp,
        latitude: "26.9124",
        longitude: "26.9124",
      });

      const { success, token, user, message } = response.data;

      if (success) {
        // ✅ Save token & user details
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        setUser(user);

        toast.success("Login successful!");

        // ✅ Role-based navigation (if needed)
        if (user.role === "admin" || user.role === "superadmin") {
          navigate("/admin/dashboard");
        } else if (user.role === "vendor") {
          navigate("/vendor/dashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error(message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      console.error("Verify OTP Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Login failed. Please check your OTP and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            {/* Left side - Image */}
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full"
                src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=1374&q=80"
                alt="Office"
              />
            </div>

            {/* Right side - Login Form */}
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  Login with OTP
                </h1>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp}>
                    <label className="block text-gray-800 dark:text-gray-400 font-medium text-sm">
                      Mobile Number
                    </label>
                    <input
                      className="block w-full border px-3 py-2 rounded-md bg-gray-100 focus:bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      type="tel"
                      name="mobile"
                      placeholder="Enter mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      maxLength={10}
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-4 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600"
                    >
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp}>
                    <label className="block text-gray-800 dark:text-gray-400 font-medium text-sm">
                      Enter OTP
                    </label>
                    <input
                      className="block w-full border px-3 py-2 rounded-md bg-gray-100 focus:bg-white border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                      type="text"
                      name="otp"
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      maxLength={6}
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full mt-4 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600"
                    >
                      {loading ? "Verifying OTP..." : "Verify & Login"}
                    </button>

                    <button
                      type="button"
                      className="w-full mt-3 text-sm text-gray-500 hover:text-emerald-500"
                      onClick={() => setOtpSent(false)}
                    >
                      ← Change mobile number
                    </button>
                  </form>
                )}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
