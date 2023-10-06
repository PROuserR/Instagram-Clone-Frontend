import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { ReactComponent as SearchIcon } from "../assets/search.svg";

const SearchPage = () => {
  const nav = useNavigate();
  const [users, setUsers] = useState([]);
  const [usersCopy, setUsersCopy] = useState([]);
  const [discoveredPosts, setDiscoveredPosts] = useState([]);
  const [discoveredPostsCopy, setDiscoveredPostsCopy] = useState([]);
  const searchQuery = useRef("");

  const search = () => {
    let filteredUsers = [];

    for (let i = 0; i < usersCopy.length; i++) {
      if (usersCopy[i].username.includes(searchQuery.current.value))
        filteredUsers.push(usersCopy[i]);
    }

    if (searchQuery.current.value.length > 0) {
      setUsers(filteredUsers);
      setDiscoveredPosts([]);
    } else {
      setUsers([]);
      setDiscoveredPosts(discoveredPostsCopy);
    }
  };

  const getDiscoveredPosts = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/discover_posts/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setDiscoveredPosts(data);
    setDiscoveredPostsCopy(data);
  };

  const getUsers = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/list_users/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setUsersCopy(data);
  };

  useEffect(() => {
    getDiscoveredPosts();
    getUsers();
  }, []);

  return (
    <div>
      <section className="p-3">
        <div className="flex bg-zinc-800 py-1 px-3 rounded-lg">
          <SearchIcon className="text-zinc-500 w-5" />
          <input
            ref={searchQuery}
            onChange={search}
            className="ml-3 text-base outline-none bg-transparent w-3/4"
            placeholder={"Search"}
          />
        </div>
      </section>

      <section className="p-2">
        {users.map((user, index) => (
          <div
            className="flex items-center mb-2"
            onClick={() => nav(`/profile/${user.id}`)}
            key={index}
          >
            <img
              className="w-12 h-12 rounded-full"
              src={`http://127.0.0.1:8000/media/${user.profile_picture}`}
            />
            <span className="ml-2">{user.username}</span>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-3 md:grid-cols-4 gap-px overflow-y-scroll pb-14">
        {discoveredPosts.map((discoveredPost, index) => (
          <div
            className="cursor-pointer"
            key={index}
            onClick={() => nav(`/post/${discoveredPost.id}`)}
          >
            <img
              src={`http://127.0.0.1:8000/media/${discoveredPost.photoes}`}
            />
          </div>
        ))}
      </section>
      <NavBar />
    </div>
  );
};

export default SearchPage;
