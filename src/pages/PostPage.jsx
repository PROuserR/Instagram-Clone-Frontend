import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import NavBar from "../components/NavBar";
import { useParams } from "react-router-dom";

const PostPage = () => {
  const { post_id } = useParams();
  const [post, setPost] = useState([]);

  const getPost = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/get_post/${post_id}`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setPost([data]);
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      <section className="my-2">
        {post.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </section>

      <NavBar />
    </>
  );
};

export default PostPage;
