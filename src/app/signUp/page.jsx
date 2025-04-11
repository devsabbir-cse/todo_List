"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [form, setForm] = useState({
    name: "",
    gmail: "",
    password: "",
    key: "sabbir.key",
  });
  const [message, setMessage] = useState("");

  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");

    try {
      const res = await fetch("http://test4180.atwebpages.com/todo-list/signUp.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const result = await res.json();

      if (result.status === "success") {
        setMessage("Signup successful! Redirecting...");
        setTimeout(() => {
          router.push("/signIn");
        }, 1500);
      } else {
        setMessage(result.message || "Something went wrong");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 to-blue-500 text-black px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
      <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-6">
          📝 To-Do List
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            name="gmail"
            placeholder="Email"
            value={form.gmail}
            onChange={handleChange}
            required
            className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full mb-6 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-200"
          >
            Sign Up
          </button>

          {message && (
            <p className="mt-4 text-center text-sm text-gray-600">{message}</p>
          )}
        </form>

        <div className="mt-6 text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/signIn")}
            className="text-blue-700 cursor-pointer hover:underline font-medium"
          >
            Sign in now
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
