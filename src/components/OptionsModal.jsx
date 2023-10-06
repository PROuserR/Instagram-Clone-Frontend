import React, { useState } from "react";
import { ReactComponent as UnfollowIcon } from "../assets/unfollow.svg";
import { ReactComponent as InfoIcon } from "../assets/info-circle.svg";
import { ReactComponent as HideIcon } from "../assets/eye-slash.svg";
import { ReactComponent as PersonIcon } from "../assets/person.svg";

const OptionsModal = ({ post }) => {
  const [isOptionsModalShown, setIsOptionsModalShown] = useState("showOptions");
  const unfollowUser = async () => {
    fetch(
      `http://127.0.0.1:8000/api/unfollow_user/${localStorage.getItem(
        "my_id"
      )}/${post.owner}`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    setIsOptionsModalShown("hideOptions");
  };

  if (isOptionsModalShown === "showOptions")
    return (
      <div className="p-2 w-screen max-w-4xl bg-white dark:bg-zinc-900 fixed left-0 bottom-10 xl:left-72 z-10">
        <div className="flex w-full">
          <button
            className="font-extrabold w-fit mx-auto text-zinc-400"
            onClick={() => setIsOptionsModalShown("hideOptions")}
          >
            ___________
          </button>
        </div>

        <section>
          <div className="flex items-center py-1.5">
            <div onClick={unfollowUser} className="flex items-center py-1.5">
              <div className="border-2 rounded-full p-2">
                <UnfollowIcon className="w-5 h-5" />
              </div>
              <span className="ml-2 text-zinc-200">Unfollow</span>
            </div>
          </div>

          <div
            onClick={() => setIsOptionsModalShown("showWhy")}
            className="flex items-center py-1.5"
          >
            <InfoIcon className="w-8 h-8 m-1" />
            <span className="ml-2 text-zinc-200">
              Why are you seeing this post
            </span>
          </div>

          <div className="flex items-center py-1.5">
            <HideIcon className="w-8 h-8 m-1" />
            <span className="ml-2 text-zinc-200">Hide</span>
          </div>
        </section>
      </div>
    );
  else if (isOptionsModalShown === "hideOptions") return null;
  else
    return (
      <div className="p-2 w-screen max-w-4xl bg-white dark:bg-zinc-900 fixed left-0 bottom-10 xl:left-72 z-10">
        <div className="flex w-full">
          <button
            className="font-extrabold w-fit mx-auto text-zinc-400"
            onClick={() => setIsOptionsModalShown("hideOptions")}
          >
            ___________
          </button>
        </div>
        <div className="flex flex-col">
          <span className="text-center font-bold text-lg">
            Why you're you seeing this post
          </span>
          <span className="text-center">
            Posts are shown in feed based on many things, including your
            activity on Instagram. <b>Learn more</b>
          </span>
        </div>

        <div className="flex space-x-4 items-center py-6">
          {post.image ? (
            <div className="md:w-14 w-10 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full p-0.5">
              <div className="w-auto h-auto bg-white dark:bg-black rounded-full p-0.5">
                <img
                  className="w-auto h-auto aspect-square rounded-full"
                  src={`http://127.0.0.1:8000/media/${post.image}`}
                />
              </div>
            </div>
          ) : (
            <div className="w-auto h-auto bg-gray-400 rounded-full p-0.5">
              <PersonIcon />
            </div>
          )}

          <span>You follow {post.username}</span>
        </div>
      </div>
    );
};

export default OptionsModal;
