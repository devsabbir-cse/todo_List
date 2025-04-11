"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SignInPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    gmail: "",
    password: "",
    key: "sabbir.key",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Signing in...");

    try {
      const res = await fetch(
        "http://test4180.atwebpages.com/todo-list/signIn.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        throw new Error("Server error");
      }

      const result = await res.json();

      if (result.status === "success") {
        setMessage("Sign in successful! Redirecting...");
        localStorage.setItem("gmail", form.gmail);
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } else {
        setMessage(result.message || "Invalid credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setMessage("Error signing in. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-green-500 text-black px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-6">
          📝 To-Do List
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="gmail"
            placeholder="Email"
            value={form.gmail}
            onChange={handleChange}
            required
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Sign In
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
          )}
        </form>

        <div className="mt-6 text-sm text-center">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signUp")}
            className="text-green-700 cursor-pointer hover:underline font-medium"
          >
            Sign up now
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
