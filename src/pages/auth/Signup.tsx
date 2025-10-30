import React from "react";
import { Link } from "react-router";

export default function Signup() {
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = React.useState<any>({});

  function validate() {
    const newErrors: any = {};
    if (!form.firstName.trim() || !form.lastName.trim()) {
      newErrors.fullName = "Họ và tên không được để trống";
    }
    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email phải đúng định dạng";
    }
    if (!form.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (form.password.length < 6) {
      newErrors.password = "Mật khẩu tối thiểu 6 ký tự";
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không được để trống";
    } else if (form.confirmPassword !== form.password) {
      newErrors.confirmPassword = "Mật khẩu phải trùng khớp";
    }
    return newErrors;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Simulate signup success
      window.alert("Đăng ký thành công!");
      window.location.href = "/login";
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/src/assets/Auth/Signup_background.png')",
        backgroundSize: "cover",
        // backgroundPosition: "center",
      }}
    >
      {/* Left side - Welcome text */}
      <div className="absolute left-20 top-1/2 -translate-y-1/2 text-white z-10 flex flex-col items-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to the website</h1>
        <p className="text-base text-gray-200 mt-8">RIKKEI EDUCATION</p>
      </div>

      {/* Right side - Signup form */}
      <div className="absolute right-75 top-1/2 -translate-y-1/2 bg-gray-100 rounded-lg shadow-2xl p-10 w-[492px] z-10">
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* First name and Last name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                name="firstName"
                type="text"
                value={form.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <label className="block text-xs text-gray-700 mt-1">First name</label>
            </div>
            <div>
              <input
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <label className="block text-xs text-gray-700 mt-1">Last name</label>
            </div>
          </div>
          {errors.fullName && <div className="text-red-500 text-xs">{errors.fullName}</div>}

          {/* Email address */}
          <div>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label className="block text-xs text-gray-700 mt-1">Email address</label>
          </div>
          {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}

          {/* Password */}
          <div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label className="block text-xs text-gray-700 mt-1">Password</label>
          </div>
          {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}

          {/* Confirm Password */}
          <div>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <label className="block text-xs text-gray-700 mt-1">Confirm Password</label>
          </div>
          {errors.confirmPassword && <div className="text-red-500 text-xs">{errors.confirmPassword}</div>}

          {/* Sign up button */}
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700 transition-colors text-sm"
          >
            Sign up
          </button>

          {/* Login link */}
          <div className="text-sm mt-3">
            <span className="text-gray-800 font-bold">Already have an account? </span>
            <Link to="/login" className="text-red-500 font-semibold hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}