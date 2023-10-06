import React, { useRef, useState } from "react";
import { ReactComponent as XIcon } from "../assets/x.svg";
import { ReactComponent as ArrowIcon } from "../assets/arrow-right.svg";
import { ReactComponent as ImagesIcon } from "../assets/images.svg";
import { ReactComponent as CheckIcon } from "../assets/check-lg.svg";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";

const AddPostPage = () => {
  const nav = useNavigate();
  const [showCaptionFlag, setShowCaptionFlag] = useState(false);
  const [formData, setFormData] = useState(new FormData());
  const upload = useRef();
  const caption = useRef();

  const addPost = async () => {
    formData.append("caption", caption.current.value);
    const res = await fetch(`http://127.0.0.1:8000/api/create_post/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log(data);
    nav("/");
  };

  const addFiles = () => {
    for (let index = 0; index < upload.current.files.length; index++) {
      formData.append("images", upload.current.files[index]);
    }

    setShowCaptionFlag(true);
  };

  if (showCaptionFlag)
    return (
      <div>
        <section className="flex items-center">
          <div onClick={() => nav("/")}>
            <XIcon />
          </div>
          <span className="ml-10 text-xl font-semibold text-black dark:text-white">
            New post
          </span>
          <div className="ml-auto mr-2 text-blue-700" onClick={addPost}>
            <CheckIcon />
          </div>
        </section>
        <input
          ref={caption}
          className="bg-transparent w-full h-10 mx-2 mt-10 outline-none"
          placeholder="Write a caption..."
        />
        <NavBar />
      </div>
    );
  else
    return (
      <div>
        <section className="flex items-center">
          <div onClick={() => nav("/")}>
            <XIcon />
          </div>
          <span className="ml-10 text-xl font-semibold text-black dark:text-white">
            New post
          </span>
          <ArrowIcon className="ml-auto mr-2 text-blue-700" />
        </section>
        <section className="fixed space-y-8 flex flex-col w-screen top-36 left-0 items-center">
          <div className="text-xl text-black dark:text-white">
            Create New Post
          </div>
          <div>
            <ImagesIcon />
          </div>
          <input onInput={addFiles} ref={upload} type="file" hidden multiple />
          <button
            onClick={() => upload.current.click()}
            className="text-lg bg-blue-600 p-1 rounded-md text-black dark:text-white"
          >
            Select from device
          </button>
        </section>
        <NavBar />
      </div>
    );
};

export default AddPostPage;
