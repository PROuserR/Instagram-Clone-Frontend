import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const CreateUserNamePage = () => {
  const nav = useNavigate();
  const username = useRef();
  const storeUsername = () => {
    sessionStorage.setItem("username", username.current.value);
    nav("/create-password");
  };

  return (
    <div className="flex flex-col items-center text-center space-y-4 p-2">
      <label className="text-2xl">Choose username</label>
      <span className="text-zinc-600">You can always change it later.</span>
      <input
        ref={username}
        className="w-5/6 p-2 bg-zinc-800 rounded-md outline-none"
        placeholder="Username"
        type="text"
      />
      <button className="w-5/6 bg-blue-500 p-2" onClick={() => storeUsername()}>
        Next
      </button>
    </div>
  );
};

export default CreateUserNamePage;
