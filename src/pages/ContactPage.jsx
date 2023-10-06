import { ReactComponent as LeftArrowIcon } from "../assets/arrow-left.svg";
import { ReactComponent as ImageIcon } from "../assets/image.svg";
import { useNavigate, useParams } from "react-router-dom";
import { React, useEffect, useRef, useState } from "react";

const ContactPage = () => {
  const sendImage = () => {
    image.current.onchange = () => {
      sendMessage(true);
    };
    image.current.click();
  };
  const nav = useNavigate();
  const [userProfile, setUserProfile] = useState([]);
  const [chatSocket, setChatSocket] = useState(
    new WebSocket(
      "ws://127.0.0.1:8000" +
        "/ws/chat/" +
        userProfile.user +
        "/" +
        localStorage.getItem("my_id") +
        "/"
    )
  );
  const [messages, setMessages] = useState([]);
  const [sendBtn, setSendBtn] = useState();
  const [imageBtn, setImageBtn] = useState(
    <div onClick={sendImage}>
      <ImageIcon className="ml-auto" />
    </div>
  );
  const message = useRef();
  const chatList = useRef();
  const image = useRef();
  const { user_id } = useParams();

  const listChat = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/chat/list_chat/${localStorage.getItem(
        "my_id"
      )}/${user_id}`
    );
    const data = await res.json();
    setMessages(data);
  };

  const sendMessage = (imageSent) => {
    if (imageSent)
      chatSocket.send(
        JSON.stringify({
          content: message.current.value,
          image: `/media/${image.current.files[0].name}`,
          peer_id: user_id,
          my_id: localStorage.getItem("my_id"),
        })
      );
    else
      chatSocket.send(
        JSON.stringify({
          content: message.current.value,
          image: "",
          peer_id: user_id,
          my_id: localStorage.getItem("my_id"),
        })
      );
    saveMessage(imageSent);
  };

  const sendMessageByEnter = (e) => {
    if (e.code === "Enter") {
      sendMessage(false);
    }
  };

  const handleMessage = () => {
    if (message.current.value) {
      setSendBtn(
        <button
          className="ml-4 text-blue-600 text-lg"
          onClick={() => sendMessage(false)}
        >
          Send
        </button>
      );
      setImageBtn();
    } else {
      setSendBtn();
      setImageBtn(
        <div onClick={sendImage}>
          <ImageIcon className="ml-auto" />
        </div>
      );
    }
  };

  const getUserInfo = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/get_profile/${user_id}`);
    const data = await res.json();
    setUserProfile(data);
  };

  const saveMessage = async (imageSent) => {
    let formData = new FormData();
    formData.append("content", message.current.value);
    formData.append("peer_id", user_id);
    formData.append("my_id", localStorage.getItem("my_id"));
    if (imageSent) formData.append("image", image.current.files[0]);

    await fetch(`http://127.0.0.1:8000/chat/add_message/`, {
      method: "POST",
      body: formData,
    });

    setSendBtn();
    setImageBtn(
      <div onClick={sendImage}>
        <ImageIcon className="ml-auto" />
      </div>
    );
  };

  const scrollBottom = () => {
    chatList.current.scrollTop = chatList.current.scrollHeight;
  };

  const getInstaDate = (string_date) => {
    let date = new Date(string_date);
    let weekdays = new Array(7);
    weekdays[0] = "Sun";
    weekdays[1] = "Mon";
    weekdays[2] = "Tue";
    weekdays[3] = "Wed";
    weekdays[4] = "Thu";
    weekdays[5] = "Fri";
    weekdays[6] = "Sat";
    let day = weekdays[date.getDay()];
    let time = date.toLocaleTimeString();
    let instaTime = time.substr(0, 4) + time.substr(7, 5);
    return `${day} ${instaTime}`;
  };

  const timeDelta1 = (string_date) => {
    let date = new Date(string_date);
    let now = new Date();
    let delta = (now - date) / 1000;
    let ago = "s ago";
    if (delta > 60) {
      delta /= 60;
      ago = "m ago";
      if (delta > 60) {
        delta /= 60;
        ago = "h ago";
        if (delta > 24) {
          delta /= 24;
          ago = "d ago";
        }
      }
    }
    delta = Math.round(delta, 2);
    return delta + ago;
  };

  const timeDelta2 = (string_date1, string_date2) => {
    let date1 = new Date(string_date1);
    let date2 = new Date(string_date2);
    let delta = (date1 - date2) / 1000;
    let ago = "s ago";
    if (delta > 60) {
      delta /= 60;
      ago = "m ago";
      if (delta > 60) {
        delta /= 60;
        ago = "h ago";
        if (delta > 24) {
          delta /= 24;
          ago = "d ago";
        }
      }
    }
    delta = Math.round(delta, 2);
    return new String(delta + ago);
  };

  useEffect(() => {
    getUserInfo();
    listChat();
  }, []);

  useEffect(() => {
    scrollBottom();
    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      let temp_messages = messages;
      temp_messages.push({
        content: data.content,
        image: data.image,
        peer_id: data.peer_id,
        my_id: data.my_id,
      });
      setMessages(temp_messages);
      handleMessage();
      message.current.value = "";
    };
  });

  return (
    <div className="h-screen p-2">
      <section className="static top-0 flex items-center w-full bg-white dark:bg-black space-x-4">
        <div onClick={() => nav("/contacts")}>
          <LeftArrowIcon />
        </div>

        <img
          className="rounded-full w-9 h-9"
          src={`http://127.0.0.1:8000${userProfile.image}`}
        />
        <div className="flex flex-col">
          <div>
            <span className="text-lg font-semibold">
              {userProfile.username}{" "}
            </span>
            <button>\/</button>
          </div>

          <span className="text-base text-gray-400">
            Active {timeDelta1(userProfile.last_login)}
          </span>
        </div>

        <span className="ml-2 text-xs"></span>
      </section>

      <section ref={chatList} className="my-4 space-y-6 overflow-scroll h-4/5">
        {messages.map((message, index) => (
          <div key={index}>
            <div className="flex">
              <div className="mx-auto text-gray-500">
                {index > 1 &&
                timeDelta2(
                  messages[index].date_added,
                  messages[index - 1].date_added
                ).includes("h")
                  ? getInstaDate(message.date_added)
                  : null}
              </div>
            </div>
            {parseInt(message.my_id) ===
            parseInt(localStorage.getItem("my_id")) ? (
              <div className="flex flex-col items-center">
                {message.content ? (
                  <span className="ml-auto mr-2 p-2 bg-blue-600 rounded-xl">
                    {message.content}
                  </span>
                ) : null}

                {message.image ? (
                  <img
                    className="w-1/2 rounded ml-auto"
                    src={`http://127.0.0.1:8000${message.image}`}
                  />
                ) : null}
              </div>
            ) : (
              <div className="flex items-center">
                <img
                  className="rounded-full w-9 h-9"
                  src={`http://127.0.0.1:8000${userProfile.image}`}
                />
                {message.content ? (
                  <span className="ml-4 p-2 bg-blue-600 rounded-xl">
                    {message.content}
                  </span>
                ) : null}

                {message.image ? (
                  <img
                    className="w-1/2 rounded ml-4"
                    src={`http://127.0.0.1:8000${message.image}`}
                  />
                ) : null}
              </div>
            )}
          </div>
        ))}
      </section>

      <section className="mb-4 fixed bottom-0 w-full max-w-4xl z-10">
        <div className="flex items-center mr-4 bg-white dark:bg-zinc-900 p-1 border dark:border-none rounded-lg">
          <input
            ref={message}
            onChange={handleMessage}
            onKeyDownCapture={sendMessageByEnter}
            className="w-[90%] outline-none bg-transparent p-1 text-black dark:text-white"
            placeholder="Message.."
          />
          <input ref={image} type="file" hidden />
          {sendBtn}
          {imageBtn}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
