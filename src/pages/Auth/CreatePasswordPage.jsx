import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const CreatePasswordPage = () => {
  const nav = useNavigate();
  const password = useRef();
  const storePassword = () => {
    sessionStorage.setItem("password", password.current.value);
    nav("/create-email");
  };

  return (
    <div className="flex flex-col items-center text-center space-y-4 p-2">
      <label className="text-2xl">Create a password</label>
      <span className="text-zinc-600">
        For secuirty, your password must be 6 characters or more
      </span>
      <input
        ref={password}
        className="w-5/6 p-2 bg-zinc-800 rounded-md outline-none"
        placeholder="Password"
        type="password"
      />
      <button className="w-5/6 bg-blue-500 p-2" onClick={storePassword}>
        Next
      </button>
    </div>
  );
};

export default CreatePasswordPage;
