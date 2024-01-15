import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";

export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null);
      navigate("/sign-in");
    } catch (e) {
      setLoading(false);
      setError(error.message);
    }
  };


  return (
    <div className=" p-3 max-w-lg mx-auto gap-3">
      <h1 className=" text-3xl text-center font-semibold">Sign up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          className=" p-3 border rounded-lg mt-3"
          id="username"
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          type="text"
          className=" p-3 border rounded-lg"
          id="email"
          placeholder="Email"
          onChange={handleChange}
        />
        <input
          type="text"
          className=" p-3 border rounded-lg"
          id="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button
        disabled = {loading}
        className="bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-95 disabled:opacity-80"
        > {loading ? "Loading..." : "Sign up"}
        </button>
        <OAuth />
      </form>
      <div className="flex  gap-2">
        <p>Have an account?</p>
        <Link to="/sign-in">
          <span className="text-blue-700">Sign in</span>
        </Link>
        {error && <p className='text-red-500 mt-5'>{error}</p>}
      </div>
    </div>
  );
}
