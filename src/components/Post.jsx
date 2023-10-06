import { React, useState, useRef, useEffect } from "react";
import { ReactComponent as DotsIcon } from "../assets/dots.svg";
import { ReactComponent as HeartIcon } from "../assets/heart.svg";
import { ReactComponent as FilledHeartIcon } from "../assets/heart-fill-red.svg";
import { ReactComponent as PersonIcon } from "../assets/person.svg";
import { ReactComponent as CommentIcon } from "../assets/messenger.svg";
import { ReactComponent as SendIcon } from "../assets/send.svg";
import { ReactComponent as SaveIcon } from "../assets/bookmark.svg";
import { ReactComponent as FilledSaveIcon } from "../assets/bookmark-fill.svg";
import CommentModal from "./CommentModal";
import SendModal from "./SendModal";
import OptionsModal from "./OptionsModal";
import Swipper from "./PostSlider";
import { useNavigate } from "react-router-dom";
import { time_delta } from "../Functions/TimeDelta";

const Post = ({ hasVideo, post }) => {
  const [heart, setHeart] = useState(<HeartIcon className="w-6" />);
  const [isHeartFilled, setIsHeartFilled] = useState(
    post.liker_id === parseInt(localStorage.getItem("my_id"))
  );
  const [save, setSave] = useState(<SaveIcon className="w-6" />);
  const [isSaveFilled, setIsSaveFilled] = useState(post.saved);
  const [likeStatment, SetLikeStatment] = useState("");
  let mentionedUser = "";
  const [postButton, setPostButton] = useState(
    <button disabled className="text-blue-600 ml-auto">
      Post
    </button>
  );
  const [commentModal, setCommentModal] = useState(null);
  const [sendModal, setSendModal] = useState(null);
  const [optionsModal, setOptionsModal] = useState(null);
  const commentInput = useRef();
  const nav = useNavigate();
  let clickCounter = 0;
  let times = [];

  const toggleHeart = async () => {
    if (isHeartFilled) {
      setHeart(<HeartIcon className="w-6" />);
      await fetch(`http://127.0.0.1:8000/api/delete_like/`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      });
    } else {
      setHeart(<FilledHeartIcon className="w-6" />);
      await fetch(`http://127.0.0.1:8000/api/add_like/${post.id}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ liker: localStorage.getItem("my_id") }),
      });
    }
    setIsHeartFilled(!isHeartFilled);
    addActivity("like");
  };
  const handleDoubleClick = () => {
    if (!isHeartFilled) {
      times.push(new Date());
      clickCounter++;
      if (times.length > 2) times.pop();

      if (
        (times[times.length - 1] - times[times.length - 2]) / 1000 < 0.3 &&
        clickCounter >= 2
      ) {
        toggleHeart();
        clickCounter = 0;
      }
    }
  };
  const toggleSave = async () => {
    if (isSaveFilled) {
      setSave(<SaveIcon />);
      await fetch(
        `http://127.0.0.1:8000/api/unsave_post/${localStorage.getItem(
          "my_id"
        )}/${post.id}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
    } else {
      setSave(<FilledSaveIcon />);
      await fetch(
        `http://127.0.0.1:8000/api/save_post/${localStorage.getItem("my_id")}/${
          post.id
        }`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
    }
    setIsSaveFilled(!isSaveFilled);
  };
  const toggleCommentModal = () => {
    if (commentModal) setCommentModal(null);
    else setCommentModal(<CommentModal post={post} />);
  };
  const toggleSendModal = () => {
    if (sendModal) setSendModal(null);
    else setSendModal(<SendModal />);
  };
  const toggleOptionsModal = () => {
    if (optionsModal) setOptionsModal(null);
    else setOptionsModal(<OptionsModal post={post} />);
  };
  const handlePostButton = () => {
    if (commentInput.current.value)
      setPostButton(
        <button onClick={addComment} className="text-blue-600 ml-auto">
          Post
        </button>
      );
    else
      setPostButton(
        <button disabled className="text-blue-600 ml-auto">
          Post
        </button>
      );
  };

  const addComment = async () => {
    await fetch(`http://127.0.0.1:8000/api/add_comment/${post.id}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        content: commentInput.current.value,
        commenter: localStorage.getItem("my_id"),
      }),
    });

    if (commentInput.current.value.includes("@")) {
      const startingIndex = commentInput.current.value.search("@") + 1;
      for (let i = startingIndex; i < commentInput.current.value.length; i++) {
        if (commentInput.current.value[i] !== " ")
          mentionedUser += commentInput.current.value[i];
        else break;
      }
      addActivity("mention");
    } else {
      addActivity("comment");
    }
  };

  const addActivity = async (action) => {
    if (action === "like") {
      if (!isHeartFilled) {
        await fetch(`http://127.0.0.1:8000/api/add_activity/`, {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            action: "Just liked your post",
            influncer: localStorage.getItem("my_id"),
            influnced: post.owner,
          }),
        });
      } else {
        await fetch(`http://127.0.0.1:8000/api/delete_activity/`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({
            action: "Just liked your post",
            influncer: localStorage.getItem("my_id"),
            influnced: post.owner,
          }),
        });
      }
    } else if (action === "comment") {
      await fetch(`http://127.0.0.1:8000/api/add_activity/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: "Just commented on your post",
          influncer: localStorage.getItem("my_id"),
          influnced: post.owner,
        }),
      });
      commentInput.current.value = "";
    } else {
      const res = await fetch(
        `http://127.0.0.1:8000/api/get_user_id/${mentionedUser}`
      );
      const mentionedUserId = (await res.json())["id"];
      await fetch(`http://127.0.0.1:8000/api/add_activity/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          action: `Mentioned you in a comment ${commentInput.current.value}`,
          influncer: localStorage.getItem("my_id"),
          influnced: mentionedUserId,
        }),
      });
      commentInput.current.value = "";
    }
  };

  useEffect(() => {
    if (isSaveFilled) setSave(<FilledSaveIcon />);
    else setSave(<SaveIcon />);

    if (isHeartFilled) setHeart(<FilledHeartIcon className="w-6" />);
    else setHeart(<HeartIcon className="w-6" />);

    if (post.likes.length > 0) {
      if (post.likes.length === 1) {
        SetLikeStatment(
          <p>
            Liked by <b>{post.liker}</b>
          </p>
        );
      } else {
        SetLikeStatment(
          <p>
            Liked by <b>{post.liker}</b> and <b>others</b>
          </p>
        );
      }
    } else {
      SetLikeStatment(<span>No likes so far..</span>);
    }
  }, []);

  return (
    <div className="w-screen mx-auto max-w-4xl z-0">
      <section className="w-full flex items-center">
        <div
          className="flex cursor-pointer"
          onClick={() => nav(`/profile/${post.owner}`)}
        >
          <div className="ml-2">
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
          </div>

          <b className="ml-2 my-auto">{post.username}</b>
        </div>

        <div className="ml-auto mr-1" onClick={toggleOptionsModal}>
          <DotsIcon />
        </div>
      </section>

      <section onClick={handleDoubleClick} className="mt-2">
        <Swipper photoes={post.photoes} hasVideo={hasVideo} />
      </section>

      <section className="mx-2 space-y-3 relative bottom-9 z-10">
        <div className="flex">
          <div className="flex space-x-6">
            <div onClick={toggleHeart}>{heart}</div>
            <div onClick={toggleCommentModal}>
              <CommentIcon className="w-6" />
            </div>
            <div onClick={toggleSendModal}>
              <SendIcon className="w-6" />
            </div>
          </div>
          <div className="ml-auto" onClick={toggleSave}>
            {save}
          </div>
        </div>

        <div>
          {likeStatment}

          <p>
            <b>{post.username}</b> {post.caption}
          </p>
        </div>

        <div className="flex w-full bg-white dark:bg-black rounded-full p-0.5">
          <img
            className="md:w-12 w-8 aspect-square rounded-full"
            src={`http://127.0.0.1:8000/media/${localStorage.getItem(
              "my_profile_picture"
            )}`}
          />
          <input
            ref={commentInput}
            onChange={handlePostButton}
            className="ml-2 text-sm outline-none bg-transparent w-3/4"
            type="text"
            placeholder="Add a comment..."
          />
          {postButton}
        </div>

        <div className="text-xs text-gray-400">
          {time_delta(post.date_added)}
        </div>
      </section>

      {commentModal}
      {sendModal}
      {optionsModal}
    </div>
  );
};

export default Post;
