import React, { useState, useEffect, useRef } from "react";
import { ReactComponent as XIcon } from "../assets/x.svg";
import { ReactComponent as CheckIcon } from "../assets/check-lg.svg";
import { ReactComponent as PersonIcon } from "../assets/person.svg";
import { useNavigate } from "react-router-dom";

const EditProfilePage = () => {
  const nav = useNavigate();
  const [profile, setProfile] = useState([]);
  const profilePicture = useRef();
  const name = useRef();
  const username = useRef();
  const pronoun = useRef();
  const bio = useRef();
  const [formData, setFormData] = useState(new FormData());

  const getProfile = async () => {
    let res = await fetch(
      `http://127.0.0.1:8000/api/get_profile/${localStorage.getItem("my_id")}`
    );
    let data = await res.json();
    setProfile([data]);
  };

  const updateProfile = async () => {
    formData.append("bio", bio.current.value);
    formData.append("user", localStorage.getItem("my_id"));

    const res = await fetch(
      `http://127.0.0.1:8000/api/update_profile/${localStorage.getItem(
        "my_id"
      )}`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();

    localStorage.setItem(
      "my_profile_picture",
      data["image"].replace("/media/", "")
    );

    await fetch(
      `http://127.0.0.1:8000/api/update_user/${localStorage.getItem("my_id")}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          firstname: name.current.value,
          username: username.current.value,
          lastname: pronoun.current.value,
        }),
      }
    );

    nav("/");
  };

  const addFiles = () => {
    formData.append("image", profilePicture.current.files[0]);
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div>
      <section className="flex items-center w-full">
        <XIcon onClick={() => nav("/my-profile")} />
        <div className="font-bold text-lg ml-4">Edit profile</div>
        <CheckIcon
          className="text-blue-600 ml-auto mr-2"
          onClick={updateProfile}
        />
      </section>

      {profile.map((profile, index) => (
        <div key={index}>
          <section className="flex flex-col items-center space-y-2">
            {localStorage.getItem("my_profile_picture") ? (
              <div className="w-auto bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full p-0.5">
                <div className="w-auto h-auto bg-white dark:bg-black rounded-full p-1">
                  <img
                    className="w-auto h-auto aspect-square rounded-full"
                    src={
                      !localStorage
                        .getItem("my_profile_picture")
                        .includes("platform-lookaside")
                        ? `http://127.0.0.1:8000/media/${localStorage.getItem(
                            "my_profile_picture"
                          )}`
                        : localStorage.getItem("my_profile_picture")
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="w-auto h-auto bg-gray-400 rounded-full p-3.5">
                <PersonIcon className="w-16 h-16" />
              </div>
            )}
            <input ref={profilePicture} onInput={addFiles} type="file" hidden />
            <button
              className="text-blue-500 text-lg"
              onClick={() => profilePicture.current.click()}
            >
              Change profile picture
            </button>
          </section>
          <br />
          <section className="flex flex-col space-y-2 mx-2">
            <label className="text-gray-400">Name</label>
            <input
              ref={name}
              className="bg-transparent border-b outline-none"
              defaultValue={profile.first_name}
            />

            <label className="text-gray-400">Username</label>
            <input
              ref={username}
              className="bg-transparent border-b outline-none"
              defaultValue={profile.username}
            />

            <label className="text-gray-400">Pronouns</label>
            <input
              ref={pronoun}
              className="bg-transparent border-b outline-none"
              defaultValue={profile.last_name}
            />

            <label className="text-gray-400">Bio</label>
            <input
              ref={bio}
              className="bg-transparent border-b outline-none"
              defaultValue={profile.bio}
            />
          </section>
        </div>
      ))}
    </div>
  );
};

export default EditProfilePage;
