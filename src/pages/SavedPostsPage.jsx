import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as ArrowIcon } from "../assets/arrow-left.svg";
import Post from "../components/Post";

const SavedPostsPage = () => {
  const nav = useNavigate();
  const [savedPosts, setSavedPosts] = useState([]);
  const getSavedPosts = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/get_saved_posts/${localStorage.getItem(
        "my_id"
      )}`
    );
    const data = await res.json();
    setSavedPosts(data);
  };

  useEffect(() => {
    getSavedPosts();
  }, []);

  return (
    <div>
      <section className="flex items-center space-x-4 p-2">
        <ArrowIcon onClick={() => nav("/my-profile")} />
        <span className="font-semibold text-xl">Saved</span>
      </section>

      <section>
        {savedPosts.map((savedPost, index) => (
          <Post post={savedPost} key={index} />
        ))}
      </section>
    </div>
  );
};

export default SavedPostsPage;
