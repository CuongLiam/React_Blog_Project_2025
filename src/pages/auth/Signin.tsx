import { message, Modal } from "antd";
import React, { type FormEvent, type ReactNode } from "react";
import { useDispatch } from "react-redux";
import { fetchEntries } from "../../store/slices/entrySlice";
import { fetchArticles } from "../../store/slices/articleSlice";
import type { AppDispatch } from "../../store";
import { Link } from "react-router";
import type { UserSigninDTO } from "../../apis/core/user.api";
import { Apis } from "../../apis";

export default function Signin({
  children
} :{
  children: ReactNode
}) {
  const dispatch = useDispatch<AppDispatch>();

  // let isAdmin = false;
  let userLogin = localStorage.getItem("userLogin");

  if (userLogin) {
    const userData = JSON.parse(userLogin);
    const role = userData?.data?.[0]?.role;
    // If trying to access /admin and not ADMIN/MASTER, redirect to user page
    if (window.location.pathname.startsWith("/admin") && role !== "ADMIN" && role !== "MASTER") {
      window.location.href = "/";
      return null;
    }
    // ADMIN/MASTER can access both admin and user pages
    return <>{children}</>;
  }
  
  const [form, setForm] = React.useState({
    emailOrUserName: "",
    password: ""
  });
  const [errors, setErrors] = React.useState<any>({});

  function validate() {
    const newErrors: any = {};
    if (!form.emailOrUserName.trim()) {
      newErrors.emailOrUserName = "Họ và tên và email không được để trống";
    }
    if (!form.password) {
      newErrors.password = "Mật khẩu không được để trống";
    }
    return newErrors;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    let data: UserSigninDTO = {
      emailOrUserName: form.emailOrUserName,
      password: form.password,
    };
    try {
      let result = await Apis.user.signin(data);
      localStorage.setItem("userLogin", JSON.stringify(result.data));
      Modal.confirm({
        title: "Successfully logged in!",
        content: result.message,
        onOk: async () => {
          const role = result.data.data[0].role;
          if (role === "ADMIN" || role === "MASTER") {
            // Fetch entries and articles, store in Redux and localStorage
            const entriesResult = await dispatch(fetchEntries()).unwrap();
            const articlesResult = await dispatch(fetchArticles()).unwrap();
            localStorage.setItem("entries", JSON.stringify(entriesResult));
            localStorage.setItem("articles", JSON.stringify(articlesResult));
            window.location.href = "/admin";
          } else {
            window.location.href = "/";
          }
        },
        onCancel: async () => {
          const role = result.data.data[0].role;
          if (role === "ADMIN" || role === "MASTER") {
            // Fetch entries and articles, store in Redux and localStorage
            const entriesResult = await dispatch(fetchEntries()).unwrap();
            const articlesResult = await dispatch(fetchArticles()).unwrap();
            localStorage.setItem("entries", JSON.stringify(entriesResult));
            localStorage.setItem("articles", JSON.stringify(articlesResult));
            window.location.href = "/admin";
          } else {
            window.location.href = "/";
          }
        }
      });
    } catch (error) {
      console.log("err", error);
      message.error(error.message);
    }
  }
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-4 text-blue-600 font-semibold text-lg">( •̀ ω •́ )✧ RIKKEI EDU BLOG</div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="grid grid-cols-2 gap-16 max-w-6xl w-full">
          {/* Left side - Illustration */}
          <div className="flex items-center justify-center">
            <img
              src="src\assets\Auth\logo_sign_in.png"
              alt="login illustration"
              className="w-full max-w-md"
            />
          </div>

          {/* Right side - Login form */}
          <div className="flex flex-col justify-center max-w-md">
            {/* Social Login */}
            <div className="mb-6 flex flex-row gap-5">
              <p className="text-sm text-gray-700 mb-3 flex items-center">Sign in with</p>
              <div className="flex gap-2">
                <button className="w-10 h-10 bg-blue-600 text-white rounded flex items-center justify-center hover:bg-blue-700">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="w-10 h-10 bg-blue-400 text-white rounded flex items-center justify-center hover:bg-blue-500">
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="w-10 h-10 bg-blue-700 text-white rounded flex items-center justify-center hover:bg-blue-800">
                  <i className="fab fa-linkedin-in"></i>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="mb-6">
              <p className="text-sm text-gray-700 font-semibold">Or</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSignIn} className="space-y-4">
              {/* Email */}
              <div>
                <input
                  name="emailOrUserName"
                  type="text"
                  value={form.emailOrUserName}
                  onChange={handleChange}
                  placeholder="Enter a valid email address"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <label className="block text-xs text-gray-700 mt-1">Email address</label>
                {errors.emailOrUserName && <div className="text-red-500 text-xs">{errors.emailOrUserName}</div>}
              </div>

              {/* Password */}
              <div>
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <label className="block text-xs text-gray-700 mt-1">Password</label>
                {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="cursor-pointer w-full bg-blue-600 text-white py-2 rounded font-medium hover:bg-blue-700 transition-colors"
              >
                Login
              </button>

              {/* Register link */}
              <div className="text-sm">
                <span className="text-gray-800">Don't have an account? </span>
                <Link to="/register" className="text-red-500 font-semibold hover:underline">
                  Register
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-blue-600 text-white py-4 px-8 flex justify-between items-center">
        <p className="text-sm">Copyright © 2025, All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-200">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="hover:text-gray-200">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="hover:text-gray-200">
            <i className="fab fa-google"></i>
          </a>
          <a href="#" className="hover:text-gray-200">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>
    </div>
  );
}