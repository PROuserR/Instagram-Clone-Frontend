import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const CreateEmailPage = () => {
  const nav = useNavigate();
  const email = useRef();
  const createUser = async (e) => {
    e.preventDefault();
    const res = await fetch(`http://127.0.0.1:8000/auth/register_user/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: sessionStorage.getItem("username"),
        password: sessionStorage.getItem("password"),
        email: email.current.value,
      }),
    });
    const data = await res.json();
    console.log(data);

    await fetch(`http://127.0.0.1:8000/api/create_profile/`, {
      method: "POST",
      body: JSON.stringify({ user: data }),
    });

    localStorage.clear();
    nav("/login");
  };

  return (
    <form
      onSubmit={createUser}
      className="flex flex-col items-center text-center space-y-4 p-2"
    >
      <label className="text-2xl">Add email</label>
      <input
        ref={email}
        className="w-5/6 p-2 bg-zinc-800 rounded-md outline-none"
        placeholder="Email"
        type="email"
      />
      <button className="w-5/6 bg-blue-500 p-2">Create</button>
    </form>
  );
};

export default CreateEmailPage;
