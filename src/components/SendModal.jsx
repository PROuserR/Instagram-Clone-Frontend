import React, { useState, useRef } from "react";
import { ReactComponent as GroupIcon } from "../assets/person-plus.svg";
import { ReactComponent as SearchIcon } from "../assets/search.svg";

const SendModal = () => {
  const [isSendModalShown, setIsSendModalShown] = useState(true);
  const searchQuery = useRef("");

  const search = () => {
    console.log(searchQuery.current.value);
  };

  const toggleSendModal = () => {
    setIsSendModalShown(!isSendModalShown);
  };

  if (isSendModalShown)
    return (
      <div className="p-2 pt-6 w-screen max-w-4xl bg-white dark:bg-zinc-900 fixed left-0 bottom-10 xl:left-72 z-10">
        <button
          className="font-extrabold absolute top-0 left-44 text-zinc-400"
          onClick={toggleSendModal}
        >
          ______
        </button>

        <section>
          <div className="flex bg-zinc-800 py-1 px-3 rounded-lg">
            <SearchIcon className="text-zinc-500 w-5" />
            <input
              ref={searchQuery}
              onChange={search}
              className="ml-3 text-base outline-none bg-transparent w-3/4"
              placeholder={"Search"}
            />
          </div>
          <div className="flex items-center py-1.5">
            <img
              className="w-10 h-10 aspect-square rounded-full m-1"
              src="https://media.gettyimages.com/photos/portrait-of-a-group-of-dirt-bikers-picture-id1383420811?s=2048x2048"
            />
            <span className="ml-2 text-zinc-200">Add post to your story</span>
            <span className="ml-auto mr-2 text-2xl text-zinc-400"></span>
          </div>
          <div className="flex items-center py-1.5">
            <div className="m-1 border-2 rounded-full p-2">
              <GroupIcon className="w-5 h-5 " />
            </div>
            <span className="ml-2 text-zinc-200">Create group</span>
          </div>
        </section>

        <section className="overflow-auto">
          <div className="flex items-center">
            <img
              className="w-10 h-10 aspect-square rounded-full m-1"
              src="https://media.gettyimages.com/photos/shailene-woodley-is-seen-on-the-set-of-three-women-on-april-25-2022-picture-id1240250830?s=2048x2048"
            />
            <span className="ml-2 text-zinc-200">Shailene Woodley</span>
            <button className="ml-auto mr-2 bg-blue-600 p-1 px-3 rounded-lg">
              Send
            </button>
          </div>

          <div className="flex items-center">
            <img
              className="w-10 h-10 aspect-square rounded-full m-1"
              src="https://media.gettyimages.com/photos/shailene-woodley-is-seen-on-the-set-of-three-women-on-april-25-2022-picture-id1240250830?s=2048x2048"
            />
            <span className="ml-2 text-zinc-200">Shailene Woodley</span>
            <button className="ml-auto mr-2 bg-blue-600 p-1 px-3 rounded-lg">
              Send
            </button>
          </div>

          <div className="flex items-center">
            <img
              className="w-10 h-10 aspect-square rounded-full m-1"
              src="https://media.gettyimages.com/photos/shailene-woodley-is-seen-on-the-set-of-three-women-on-april-25-2022-picture-id1240250830?s=2048x2048"
            />
            <span className="ml-2 text-zinc-200">Shailene Woodley</span>
            <button className="ml-auto mr-2 bg-blue-600 p-1 px-3 rounded-lg">
              Send
            </button>
          </div>

          <div className="flex items-center">
            <img
              className="w-10 h-10 aspect-square rounded-full m-1"
              src="https://media.gettyimages.com/photos/shailene-woodley-is-seen-on-the-set-of-three-women-on-april-25-2022-picture-id1240250830?s=2048x2048"
            />
            <span className="ml-2 text-zinc-200">Shailene Woodley</span>
            <button className="ml-auto mr-2 bg-blue-600 p-1 px-3 rounded-lg">
              Send
            </button>
          </div>

          <div className="flex items-center">
            <img
              className="w-10 h-10 aspect-square rounded-full m-1"
              src="https://media.gettyimages.com/photos/shailene-woodley-is-seen-on-the-set-of-three-women-on-april-25-2022-picture-id1240250830?s=2048x2048"
            />
            <span className="ml-2 text-zinc-200">Shailene Woodley</span>
            <button className="ml-auto mr-2 bg-blue-600 p-1 px-3 rounded-lg">
              Send
            </button>
          </div>

          <div className="flex items-center">
            <img
              className="w-10 h-10 aspect-square rounded-full m-1"
              src="https://media.gettyimages.com/photos/shailene-woodley-is-seen-on-the-set-of-three-women-on-april-25-2022-picture-id1240250830?s=2048x2048"
            />
            <span className="ml-2 text-zinc-200">Shailene Woodley</span>
            <button className="ml-auto mr-2 bg-blue-600 p-1 px-3 rounded-lg">
              Send
            </button>
          </div>
        </section>
      </div>
    );
  else return null;
};

export default SendModal;
