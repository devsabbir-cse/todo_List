"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTodo, setNewTodo] = useState({ title: "", body: "" });
  const [editingId, setEditingId] = useState(null);

  const gmail = typeof window !== "undefined" ? localStorage.getItem("gmail") : null;
  const tableName = gmail ? gmail.replace(/@/, "_") : "";

  useEffect(() => {
    if (!gmail) {
      router.push("/signIn");
    } else {
      fetchData(tableName);
    }
  }, []);

  const fetchData = async (tableName) => {
    try {
      const res = await fetch(
        `http://test4180.atwebpages.com/todo-list/get_data.php?tablename=${tableName}&key=sabbir.key`
      );
      const result = await res.json();

      if (result.status === "success") {
        setData(result.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!newTodo.title || !newTodo.body) return alert("Fill all fields");

    const url = editingId
      ? "http://test4180.atwebpages.com/todo-list/update.php"
      : "http://test4180.atwebpages.com/todo-list/insert_data.php";

    const payload = {
      tablename: tableName,
      title: newTodo.title,
      body: newTodo.body,
      key: "sabbir.key",
    };

    if (editingId) payload.id = editingId;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.status === "success") {
        setShowModal(false);
        setNewTodo({ title: "", body: "" });
        setEditingId(null);
        fetchData(tableName);
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setNewTodo({ title: item.title, body: item.body });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch("http://test4180.atwebpages.com/todo-list/delete.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tablename: tableName, id, key: "sabbir.key" }),
      });

      const result = await res.json();

      if (result.status === "success") {
        fetchData(tableName);
      } else {
        alert("Failed to delete");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-200 p-6 text-black">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 drop-shadow-md">
        📝 My Todo List
      </h1>

      <div className="flex justify-between mb-6 max-w-4xl mx-auto">
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl shadow-md transition"
          onClick={() => {
            localStorage.removeItem("gmail");
            window.location.href = "/signIn";
          }}
        >
          Logout
        </button>
        <div className="bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow-md text-indigo-700 font-medium text-sm flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
          {gmail}
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setNewTodo({ title: "", body: "" });
            setShowModal(true);
          }}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-md transition"
        >
          Add Task
        </button>
      </div>

      {loading ? (
        <p className="text-center text-lg">Loading...</p>
      ) : data.length > 0 ? (
        <div className="grid gap-6 max-w-4xl mx-auto">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg p-5 transition hover:scale-[1.02]"
            >
              <h2 className="text-2xl font-semibold text-indigo-700 mb-2">{item.title}</h2>
              <p className="text-gray-700">{item.body}</p>
              <div className="mt-4 flex gap-4">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-lg text-white font-medium transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-400 hover:bg-red-500 px-4 py-2 rounded-lg text-white font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">No tasks available.</p>
      )}

{showModal && (
  <div className="fixed inset-0 backdrop-blur-md bg-transparent flex justify-center items-center z-50 transition-all duration-300">
    <div className="bg-white bg-opacity-90 border border-gray-200 rounded-3xl p-8 w-full max-w-md shadow-2xl animate-fade-in">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-600">
        {editingId ? "✏️ Edit Todo" : "🆕 Add New Todo"}
      </h2>

      <input
        type="text"
        placeholder="Enter title"
        value={newTodo.title}
        onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
        className="w-full mb-4 p-4 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
      />

      <textarea
        placeholder="Enter details"
        value={newTodo.body}
        onChange={(e) => setNewTodo({ ...newTodo, body: e.target.value })}
        className="w-full mb-6 p-4 h-32 rounded-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
      />

      <div className="flex justify-end gap-4">
        <button
          onClick={() => {
            setShowModal(false);
            setEditingId(null);
          }}
          className="px-5 py-2 rounded-xl bg-gray-400 hover:bg-gray-500 text-white font-medium transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold shadow-lg transition"
        >
          {editingId ? "Update" : "Save"}
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default HomePage;
