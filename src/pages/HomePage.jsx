import React, { useContext, useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import Post from "../components/Post";
import { ReactComponent as WhiteInstaIcon } from "../assets/brand-white.svg";
import { ReactComponent as BlackInstaIcon } from "../assets/brand-black.svg";
import { ReactComponent as SendIcon } from "../assets/send.svg";
import { ReactComponent as PlusIcon } from "../assets/plus-lg.svg";
import { ReactComponent as PersonIcon } from "../assets/person.svg";
import { useNavigate } from "react-router-dom";
import InstaStorySlider from "../components/StorySlider";
import { StoryContext } from "../StoryContext";

const HomePage = () => {
  const [instagramBrandIcon, setInstagramBrandIcon] = useState(
    <WhiteInstaIcon className="w-32" />
  );
  const [userId, setUserId] = useState();
  const [posts, setPosts] = useState([]);
  const [myStory, setMyStory] = useState([]);
  const [stories, setStories] = useState([]);
  const [storySliderData, setStorySliderData] = useState();
  const [storyContext, setStoryContext] = useContext(StoryContext);
  const nav = useNavigate();

  const handleTheme = () => {
    window.matchMedia("(prefers-color-scheme: dark)").onchange = () => {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setInstagramBrandIcon(<WhiteInstaIcon className="w-36" />);
      } else {
        setInstagramBrandIcon(<BlackInstaIcon className="w-36" />);
      }
    };
  };

  const getPosts = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/news_feed/", {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();

    setPosts(data);
  };

  const getMyStory = async () => {
    const response = await fetch(`http://127.0.0.1:8000/api/get_my_story/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    const data = await response.json();
    if (data.storyPhotoes !== undefined) setMyStory([data]);
    else setMyStory([{ storyPhotoes: [], profileImage: "" }]);
  };

  const getStories = async () => {
    const response = await fetch(
      `http://127.0.0.1:8000/api/get_users_stories/`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await response.json();
    setStories(data);
  };

  const updateUserLastLogin = async () => {
    await fetch(
      `http://127.0.0.1:8000/auth/user_last_login_update/${localStorage.getItem(
        "my_id"
      )}`
    );
  };

  useEffect(() => {
    getPosts();
    getMyStory();
    getStories();
    updateUserLastLogin();
    handleTheme();
  }, []);

  return (
    <div className="mb-10">
      <section className="flex h-14 lg:px-4">
        {instagramBrandIcon}
        <div className="flex space-x-4 ml-auto mr-2 items-center">
          <SendIcon
            className="w-7 cursor-pointer"
            onClick={() => nav("/contacts")}
          />
        </div>
      </section>

      <section className="flex w-screen space-x-3 px-4">
        {myStory.map((story, index) => (
          <div
            className="w-16"
            key={index}
            onClick={() => {
              if (story.storyPhotoes.length > 0) {
                setStoryContext(story.storyPhotoes.length > 0 ? true : false);
                setUserId(myStory.username);
                setStorySliderData(story);
              } else nav("/addStory");
            }}
          >
            <div className="w-auto h-auto bg-white dark:bg-black rounded-full p-0.5">
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
                  <PersonIcon />
                </div>
              )}
              {story.storyPhotoes.length > 0 ? (
                <div className="p-2.5"></div>
              ) : (
                <PlusIcon className="relative w-5 h-5 border-2 border-black bottom-4 left-10 bg-blue-500 rounded-full" />
              )}
            </div>
            <div className="relative bottom-5 text-center">Your story</div>
          </div>
        ))}

        {stories.map((story, index) => (
          <div
            key={index}
            className="w-16"
            onClick={() => {
              setStoryContext(story.storyPhotoes.length > 0 ? true : false);
              setUserId(story.username);
              setStorySliderData(story);
            }}
          >
            <div className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-full p-0.5">
              <div className="w-auto h-auto bg-white dark:bg-black rounded-full p-0.5">
                <img
                  className="w-auto h-auto aspect-square rounded-full"
                  src={`http://127.0.0.1:8000/media/${story.profilePicture}`}
                />
              </div>
            </div>
            <div className="text-center">{story.username}</div>
          </div>
        ))}

        {storyContext ? <InstaStorySlider story={storySliderData} /> : null}
      </section>

      <section>
        {posts.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </section>

      <NavBar />
    </div>
  );
};

export default HomePage;
