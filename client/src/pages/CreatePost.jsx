import { useState } from "react";
import { api } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    pickupLocation: "",
    quantity: "",
    image: null,
  });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    await api.post("/posts", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    navigate("/");
  };

  return (
    <form className="bg-white p-6 shadow-md rounded-lg max-w-md mx-auto"
      onSubmit={submit}
    >
      <h2 className="text-2xl font-bold mb-4">Create Food Post</h2>

      <input className="w-full p-2 border rounded mb-3" placeholder="Title"
        onChange={(e) => setForm({ ...form, title: e.target.value })} />

      <textarea className="w-full p-2 border rounded mb-3" placeholder="Description"
        onChange={(e) => setForm({ ...form, description: e.target.value })} />

      <input className="w-full p-2 border rounded mb-3" placeholder="Pickup Location"
        onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })} />

      <input className="w-full p-2 border rounded mb-3" placeholder="Quantity"
        type="number" onChange={(e) => setForm({ ...form, quantity: e.target.value })} />

      <input type="file" className="w-full mb-3"
        onChange={(e) => setForm({ ...form, image: e.target.files[0] })} />

      <button className="w-full bg-green-600 text-white p-2 rounded">
        Submit
      </button>
    </form>
  );
}
