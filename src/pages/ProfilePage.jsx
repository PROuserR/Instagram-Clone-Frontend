import React, { useEffect, useRef, useState } from "react";
import NavBar from "../components/NavBar";
import { ReactComponent as PlusIcon } from "../assets/plus-lg.svg";
import { ReactComponent as ListIcon } from "../assets/list.svg";
import { ReactComponent as PersonPlusIcon } from "../assets/person-plus.svg";
import { ReactComponent as GridIcon } from "../assets/grid.svg";
import { ReactComponent as PersonSquarecon } from "../assets/person-square.svg";
import { ReactComponent as SaveIcon } from "../assets/bookmark.svg";
import { useNavigate, useParams } from "react-router-dom";

const ProfilePage = () => {
  const nav = useNavigate();
  const [profile, setProfile] = useState([]);
  const [postsGrid, setPostsGrid] = useState([]);
  const [taggedGrid, setTaggedGrid] = useState([]);
  const [postsGridCopy, setPostsGridCopy] = useState([]);
  const [discoverUsers, setDiscoverUsers] = useState([]);
  const [discoverUsersCopy, setDiscoverUsersCopy] = useState([]);
  const [loginMenuFlag, setLoginMenuFlag] = useState(false);
  const [settingsMenuFlag, setSettingsMenuFlag] = useState(false);
  const [isUserFollowed, setIsUserFollowed] = useState();
  const postsGridBtn = useRef();
  const taggedGridBtn = useRef();
  const { profile_id } = useParams();
  const taggedGridEmptyContent = (
    <section className="flex flex-col items-center text-center space-y-2">
      <div className="border-2 w-fit rounded-full p-6">
        <PersonSquarecon className="w-10 h-10 mx-auto" />
      </div>
      <div className="font-bold text-xl">Photos and videos of you</div>
      <div className="text-gray-400 w-64">
        When people tag you in photos and videos, they'll appear here
      </div>
      <div className="pb-20"></div>
    </section>
  );

  const getProfile = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/get_profile/${profile_id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.json();
    setProfile([data]);
    setIsUserFollowed(
      data.followers.includes(parseInt(localStorage.getItem("my_id")))
    );
  };

  const followUser = async () => {
    setIsUserFollowed(true);
    await fetch(
      `http://127.0.0.1:8000/api/follow_user/${localStorage.getItem("my_id")}/${
        profile[0].user
      }`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("Added follow activity");
    await fetch(`http://127.0.0.1:8000/api/add_activity/`, {
      method: "POST",
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        action: "Started following you",
        influncer: localStorage.getItem("my_id"),
        influnced: profile[0].user,
      }),
    });
  };

  const unfollowUser = async () => {
    setIsUserFollowed(false);
    await fetch(
      `http://127.0.0.1:8000/api/unfollow_user/${localStorage.getItem(
        "my_id"
      )}/${profile[0].user}`,
      {
        method: "POST",
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
  };

  const getPostsGrid = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/api/list_user_posts/${profile_id}`,
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.json();
    setPostsGrid(data);
    setPostsGridCopy(data);
  };

  const getDiscoverUsers = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/list_users/`, {
      headers: {
        Authorization: `Token ${localStorage.getItem("token")}`,
      },
    });
    const data = await res.json();
    setDiscoverUsersCopy(data);
  };

  const togglePostsGrid = () => {
    taggedGridBtn.current.classList.remove("border-b-2");
    postsGridBtn.current.classList.add("border-b-2");
    setPostsGrid(postsGridCopy);
    setTaggedGrid(null);
  };

  const toggleTaggedGrid = () => {
    postsGridBtn.current.classList.remove("border-b-2");
    taggedGridBtn.current.classList.add("border-b-2");
    setPostsGrid([]);
    setTaggedGrid(taggedGridEmptyContent);
  };

  const toggleDiscoverUsers = () => {
    if (discoverUsers.length > 0) setDiscoverUsers([]);
    else setDiscoverUsers(discoverUsersCopy);
  };

  useEffect(() => {
    getProfile();
    getPostsGrid();
    getDiscoverUsers();
  }, []);
  return (
    <div>
      {profile.map((profile, index) => (
        <div key={index}>
          <section className="flex items-center p-2">
            <span className="text-lg font-semibold">{profile.username}</span>
            <div
              className="ml-2 text-xs"
              onClick={() => setLoginMenuFlag(!loginMenuFlag)}
            >
              \/
            </div>
            <ListIcon
              className="w-8 h-8 ml-auto"
              onClick={() => setSettingsMenuFlag(!settingsMenuFlag)}
            />
            {loginMenuFlag ? (
              <div className="flex flex-col space-y-4 p-4 pt-6 w-screen max-w-4xl bg-white dark:bg-zinc-900 fixed left-0 bottom-10 xl:left-72 z-10">
                <button
                  className="font-extrabold absolute top-0 left-44 text-zinc-400"
                  onClick={() => setLoginMenuFlag(!loginMenuFlag)}
                >
                  ______
                </button>
                <div className="flex items-center space-x-2">
                  <img
                    className="rounded-full w-12"
                    src={`http://127.0.0.1:8000${profile.image}`}
                  />
                  <span className="text-lg font-semibold">
                    {profile.username}
                  </span>

                  <div className="relative p-2 bg-blue-600 rounded-full left-[60%] xl:left-[75%]">
                    <div className="p-1 bg-white dark:bg-black rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="border border-gray-500 rounded-full p-1.5">
                    <PlusIcon
                      className="w-8 h-8 cursor-pointer"
                      onClick={() => nav("/addPost")}
                    />
                  </div>
                  <span
                    className="text-lg font-semibold"
                    onClick={() => nav("/login")}
                  >
                    Add account
                  </span>
                </div>
              </div>
            ) : null}

            {settingsMenuFlag ? (
              <div className="p-4 pt-6 w-screen max-w-4xl bg-white dark:bg-zinc-900 fixed left-0 bottom-10 xl:left-72 z-10">
                <div
                  className="flex w-full items-center space-x-3"
                  onClick={() => nav("/saved-posts")}
                >
                  <SaveIcon />
                  <span className="font-semibold">Saved</span>
                </div>
              </div>
            ) : null}
          </section>

          <section className="p-3 flex items-center">
            <img
              className="rounded-full w-[75px]"
              src={`http://127.0.0.1:8000${profile.image}`}
            />
            <div className="flex mx-auto space-x-8">
              <div className="flex flex-col items-center">
                <span className="font-semibold">{profile.posts.length}</span>
                <span>Posts</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold">
                  {profile.followers.length}
                </span>
                <span>Followers</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="font-semibold">
                  {profile.following.length}
                </span>
                <span>Following</span>
              </div>
            </div>
          </section>

          <section className="px-2">
            <p>
              {profile.firstname} {profile.lastname}
            </p>
            <p>{profile.bio}</p>

            <div className="flex space-x-2 mt-2">
              {isUserFollowed ? (
                <button className="w-full bg-zinc-900" onClick={unfollowUser}>
                  Following
                </button>
              ) : (
                <button className="w-full bg-zinc-900" onClick={followUser}>
                  Follow
                </button>
              )}
              <button className="w-full bg-zinc-900" onClick={() => {}}>
                Message
              </button>
              <button className="bg-zinc-900 p-1" onClick={toggleDiscoverUsers}>
                <PersonPlusIcon />
              </button>
            </div>
          </section>

          <section className="p-2">
            {discoverUsers.length > 0 ? (
              <div className="w-full py-3">Discover people</div>
            ) : null}

            <div className="flex space-x-2">
              {discoverUsers.map((discoverUser, index) => (
                <div
                  key={index}
                  className="flex flex-col border w-fit items-center overflow-scroll"
                >
                  <div className="flex flex-col p-4 items-center">
                    <img
                      className="aspect-square w-[75px] rounded-full"
                      src={`http://127.0.0.1:8000${discoverUser.image}`}
                    />
                    <span className="font-semibold">
                      {discoverUser.username}
                    </span>
                  </div>
                  <div className="flex flex-col items-center w-4/5">
                    <button className="p-2 mb-2 bg-blue-500 w-full rounded-md">
                      Follow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="px-2 py-6">
            <section className="flex items-center">
              <div
                className="flex border-b-2 w-1/2 py-1"
                ref={postsGridBtn}
                onClick={togglePostsGrid}
              >
                <GridIcon className="mx-auto" />
              </div>

              <div
                className="flex w-1/2 py-1"
                ref={taggedGridBtn}
                onClick={toggleTaggedGrid}
              >
                <PersonSquarecon className="mx-auto" />
              </div>
            </section>

            <section className="grid grid-flow-row grid-cols-3 md:grid-cols-4  gap-px overflow-scroll pb-14">
              {postsGrid.map((post, index) => (
                <img
                  key={index}
                  className="h-24 w-full object-cover"
                  src={`http://127.0.0.1:8000/media/${post.photoes}`}
                  onClick={() => nav(`/post/${post.id}`)}
                />
              ))}
            </section>

            {taggedGrid}
          </section>
        </div>
      ))}
      <NavBar />
    </div>
  );
};

export default ProfilePage;
