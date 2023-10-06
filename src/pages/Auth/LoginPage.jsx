import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as FacebookIcon } from "../../assets/facebook.svg";
import { ReactComponent as WhiteInstaIcon } from "../../assets/brand-white.svg";
import AuthAlert from "../../components/AuthAlert";
import { useNavigate } from "react-router-dom";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";

const LoginPage = () => {
  const nav = useNavigate();
  const username = useRef();
  const password = useRef();
  const loginBtn = useRef();
  const [loginBtnColor, setloginBtnColor] = useState("bg-blue-900");
  const [isShown, setIsShown] = useState(false);

  const loginUser = async () => {
    const res1 = await fetch(`http://127.0.0.1:8000/auth/login_user/`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        username: username.current.value,
        password: password.current.value,
      }),
    });
    const data1 = await res1.json();

    const res2 = await fetch(`http://127.0.0.1:8000/api/get_my_user_info/`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Token ${data1["token"]}`,
      },
    });
    const data2 = await res2.json();

    if (data2.my_id) {
      localStorage.setItem("token", data1["token"]);
      localStorage.setItem("my_username", data2["my_username"]);
      localStorage.setItem("my_id", data2["my_id"]);
      localStorage.setItem("my_profile_picture", data2["my_profile_picture"]);
      nav("/");
    } else {
      username.current.value = "";
      password.current.value = "";
      setIsShown(true);
    }
  };

  const checkInputs = () => {
    if (username.current.value && password.current.value) {
      loginBtn.current.disabled = false;
      setloginBtnColor("bg-blue-500");
    } else {
      loginBtn.current.disabled = true;
      setloginBtnColor("bg-blue-900");
    }
  };

  const socialLogin = async () => {
    const res1 = await fetch(
      `http://127.0.0.1:8000/auth/generate_token/${localStorage.my_username}`
    );
    const data1 = await res1.json();
    localStorage.setItem("token", data1);

    if (localStorage.socialLoggedFlag === "true") {
      const img = await fetch(localStorage.my_profile_picture);
      const blob = await img.blob();
      const file = new File(
        [blob],
        `facebook-profilePicture-${localStorage.my_username}.jpg`
      );

      const formData = new FormData();
      formData.append("user", localStorage.getItem("my_id"));
      formData.append("image", file);

      await fetch(`http://127.0.0.1:8000/api/create_profile/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
        method: "POST",
        body: formData,
      });
      localStorage.setItem("socialLoggedFlag", false);
    }
    nav("/");
  };

  const responseFacebook = (response) => {
    if (!localStorage.socialLoggedFlag)
      localStorage.setItem("socialLoggedFlag", true);
    localStorage.setItem("my_username", response.name.replace(" ", ""));
    localStorage.setItem("my_profile_picture", response.picture["data"].url);
    socialLogin();
  };

  useEffect(() => {
    loginBtn.current.disabled = true;
  }, []);

  return (
    <div className="flex flex-col xl:my-[20%] my-[35%] items-center text-center space-y-4 p-2">
      <WhiteInstaIcon className="w-56" />

      <input
        ref={username}
        className="w-5/6 p-2 bg-zinc-800 rounded-md outline-none"
        placeholder="Username"
        type="text"
        onChange={checkInputs}
      />
      <input
        ref={password}
        className="w-5/6 p-2 bg-zinc-800 rounded-md outline-none"
        type="password"
        placeholder="Password"
        onChange={checkInputs}
      />
      <button
        ref={loginBtn}
        className={`w-5/6 ${loginBtnColor} p-2`}
        onClick={loginUser}
      >
        Login
      </button>

      <section>
        <span className="text-zinc-500">Forget your login details? </span>
        <span>Get help logging in</span>
      </section>

      <section className="flex w-5/6">
        <div className="relative bottom-2 border-b-2 w-1/2 border-zinc-700 p-1"></div>
        <span className="text-zinc-500 mx-2">OR</span>
        <div className="relative bottom-2 border-b-2 w-1/2 border-zinc-700 p-1"></div>
      </section>

      <FacebookLogin
        appId="822570385621746"
        fields="name,email,picture"
        callback={responseFacebook}
        render={(renderProps) => (
          <div className="flex space-x-4 items-center bg-blue-500 p-3">
            <FacebookIcon className="w-6 h-6" />
            <button onClick={renderProps.onClick}>
              Continue with Facebook
            </button>
          </div>
        )}
      />

      <section className="absolute w-full max-w-4xl bottom-0 border-t border-zinc-800 py-4">
        <span className="text-zinc-600">Don't have an account? </span>
        <button onClick={() => nav("/create-username")}>Sign up</button>
      </section>
      {isShown ? <AuthAlert /> : null}
    </div>
  );
};

export default LoginPage;
