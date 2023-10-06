import React, { useContext, useEffect, useRef, useState } from "react";
import { ReactComponent as LeftArrowIcon } from "../assets/arrow-left.svg";
import { useNavigate } from "react-router-dom";
import { ReactComponent as SearchIcon } from "../assets/search.svg";
import { OnlineUsersContext } from "../OnlineUsersContext";
import { time_delta } from "../Functions/TimeDelta";

const ContactsPage = () => {
  const nav = useNavigate();
  const [followedUsersCopy, setFollowedUsersCopy] = useState([]);
  const [onlineUsersContext, setOnlineUsersContext] =
    useContext(OnlineUsersContext);
  const [followedUsers, setFollowedUsers] = useState([]);
  const searchQuery = useRef("");

  const search = () => {
    let filteredUsers = [];

    for (let i = 0; i < followedUsersCopy.length; i++) {
      if (followedUsersCopy[i].username.includes(searchQuery.current.value))
        filteredUsers.push(followedUsersCopy[i]);
    }

    if (searchQuery.current.value.length > 0) {
      setFollowedUsers(filteredUsers);
    } else {
      setFollowedUsers(followedUsersCopy);
    }
  };

  const getFollowedUsers = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/list_followed_users/${localStorage.getItem(
        "my_id"
      )}`
    );
    const data = await res.json();
    setFollowedUsersCopy(data);
    setFollowedUsers(data);
  };

  useEffect(() => {
    getFollowedUsers();
  }, []);

  return (
    <div>
      <div className="p-2">
        <section className="sticky top-0 left-2 bg-white dark:bg-black flex items-center py-2 space-x-4 z-10">
          <div onClick={() => nav("/")}>
            <LeftArrowIcon />
          </div>

          <span className="text-lg font-semibold">
            {localStorage.getItem("my_username")}
          </span>
          <button className="text-xs">\/</button>
        </section>

        <section className="py-4">
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

        <section>
          {onlineUsersContext.map((onlineUser, index) => (
            <div key={index} className="flex space-x-4 overflow-x-scroll">
              {onlineUser.id !== localStorage.getItem("my_id") ? (
                <div
                  onClick={() => nav(`/contact/${onlineUser.id}`)}
                  className="flex flex-col items-center"
                >
                  <img
                    className="rounded-full w-12 h-12"
                    src={`http://127.0.0.1:8000/media/${onlineUser.profile_picture}`}
                  />
                  <span className="text-xs">{onlineUser.username}</span>
                  <div className="relative left-4 bottom-7 bg-lime-600 p-1.5 rounded-full"></div>
                </div>
              ) : null}
            </div>
          ))}
        </section>

        <section>
          <div className="my-4 font-semibold">Messages</div>
          {followedUsers.map((followedUser, index) => (
            <div key={index} onClick={() => nav(`/contact/${followedUser.id}`)}>
              <div className="flex space-x-3">
                <div>
                  <img
                    className="rounded-full w-12 h-12"
                    src={`http://127.0.0.1:8000/media/${followedUser.profile_picture}`}
                  />
                </div>
                <div className="flex flex-col">
                  <span className="mt-1">{followedUser.username}</span>
                  <span className="text-gray-400 text-xs">
                    Active {time_delta(followedUser.last_seen)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
};

export default ContactsPage;
