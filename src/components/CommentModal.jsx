import { React, useState, useRef, useEffect } from "react";
import { ReactComponent as ArrowIcon } from "../assets/arrow-left.svg";
import { ReactComponent as SendIcon } from "../assets/send.svg";
import { ReactComponent as PersonIcon } from "../assets/person.svg";
import { time_delta } from "../Functions/TimeDelta";

const CommentModal = ({ post }) => {
  const [postButton, setPostButton] = useState(
    <button disabled className="text-blue-600 ml-auto mr-2">
      Post
    </button>
  );
  const [isCommentModalShown, setIsCommentModalShown] = useState(true);
  const [comments, setComments] = useState([]);
  const commentInput = useRef();

  const getComments = async () => {
    let res = await fetch(`http://127.0.0.1:8000/api/get_comments/${post.id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    let data = await res.json();
    setComments(data);
  };

  const handlePostButton = () => {
    console.log(commentInput.current.value);
    if (commentInput.current.value.length > 0)
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

  const addEmoji = (emoji) => {
    setPostButton(
      <button onClick={addComment} className="text-blue-600 ml-auto">
        Post
      </button>
    );
    switch (emoji) {
      case "heart":
        commentInput.current.value += "❤";
        break;
      case "clap1":
        commentInput.current.value += "🙌";
        break;
      case "fire":
        commentInput.current.value += "🔥";
        break;
      case "clap2":
        commentInput.current.value += "👏";
        break;
      case "cry":
        commentInput.current.value += "😢";
        break;
      case "love":
        commentInput.current.value += "😍";
        break;
      case "wow":
        commentInput.current.value += "😲";
        break;
      case "laugh":
        commentInput.current.value += "😂";
        break;
      default:
        break;
    }
  };

  const exitModal = () => {
    setIsCommentModalShown(false);
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
    commentInput.current.value = "";
    exitModal();
  };

  useEffect(() => {
    getComments();
  }, []);

  if (isCommentModalShown)
    return (
      <div className="w-screen h-screen max-w-4xl fixed bg-white dark:bg-black  bottom-0 left-0 xl:left-80 z-10 p-2">
        <section className="flex">
          <ArrowIcon className="w-7 h-7" onClick={exitModal} />
          <span className="ml-8 text-xl font-semibold">Comments</span>
          <SendIcon className="ml-auto mr-1.5 mt-1 w-6 h-6" />
        </section>

        <section className="flex-col my-4 space-y-4">
          {comments.map((comment, index) => (
            <div className="flex" key={index}>
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
                <div className="w-auto h-auto bg-gray-400 rounded-full p-1">
                  <PersonIcon />
                </div>
              )}

              <div>
                <div className="flex ">
                  <b className="ml-2">{comment.username}</b>
                  <p className="ml-2">{comment.comment.content}</p>
                </div>
                <span className="ml-2 text-sm text-slate-400">
                  {time_delta(comment.comment.date_added)}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="w-full bg-white dark:bg-zinc-900 absolute bottom-11 left-0">
          <div className="flex">
            <div className="text-2xl mx-auto" onClick={() => addEmoji("heart")}>
              ❤
            </div>
            <div className="text-2xl mx-auto" onClick={() => addEmoji("clap1")}>
              🙌
            </div>
            <div className="text-2xl mx-auto" onClick={() => addEmoji("fire")}>
              🔥
            </div>
            <div className="text-2xl mx-auto" onClick={() => addEmoji("clap2")}>
              👏
            </div>
            <div className="text-2xl mx-auto" onClick={() => addEmoji("cry")}>
              😢
            </div>
            <div className="text-2xl mx-auto" onClick={() => addEmoji("love")}>
              😍
            </div>
            <div className="text-2xl mx-auto" onClick={() => addEmoji("wow")}>
              😲
            </div>
            <div className="text-2xl mx-auto" onClick={() => addEmoji("laugh")}>
              😂
            </div>
          </div>
          <div className="flex p-2">
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
              <div className="w-auto h-auto bg-gray-400 rounded-full p-1">
                <PersonIcon />
              </div>
            )}
            <input
              ref={commentInput}
              onChange={handlePostButton}
              className="ml-2 text-sm outline-none bg-transparent w-3/4"
              type="text"
              placeholder="Add a comment..."
            />
            {postButton}
          </div>
        </section>
      </div>
    );
  else return null;
};

export default CommentModal;
