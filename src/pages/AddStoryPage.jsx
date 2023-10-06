import React, { useRef, useState } from "react";
import { ReactComponent as XIcon } from "../assets/x.svg";
import { ReactComponent as ImagesIcon } from "../assets/images.svg";
import { useNavigate } from "react-router-dom";

const AddStoryPage = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState(new FormData());
  const [addStoryBtn, setAddStoryBtn] = useState(null);
  const upload = useRef();

  const addStory = async () => {
    await fetch(`http://127.0.0.1:8000/api/add_story/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      method: "POST",
      body: formData,
    });
    nav("/");
  };

  const addFiles = () => {
    formData.append("owner", localStorage.getItem("my_id"));
    for (let index = 0; index < upload.current.files.length; index++) {
      formData.append("images", upload.current.files[index]);
    }
    setAddStoryBtn(
      <button
        onClick={addStory}
        className="text-lg bg-blue-600 p-1 rounded-md text-black dark:text-white"
      >
        Add Story
      </button>
    );
  };

  return (
    <div>
      <section className="flex items-center">
        <div onClick={() => nav("/")}>
          <XIcon />
        </div>
        <span className="ml-10 text-xl font-semibold text-black dark:text-white">
          Add to story
        </span>
      </section>
      <section className="fixed space-y-8 flex flex-col w-screen top-36 left-0 items-center">
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
        {addStoryBtn}
      </section>
    </div>
  );
};

export default AddStoryPage;
