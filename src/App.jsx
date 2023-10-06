import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { StoryContext } from "./StoryContext";
import { OnlineUsersContext } from "./OnlineUsersContext";
import LoginPage from "./pages/Auth/LoginPage";
import CreateUserNamePage from "./pages/Auth/CreateUserNamePage";
import CreatePasswordPage from "./pages/Auth/CreatePasswordPage";
import CreateEmailPage from "./pages/Auth/CreateEmailPage";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";
import AddPostPage from "./pages/AddPostPage";
import AddStoryPage from "./pages/AddStoryPage";
import NotificationsPage from "./pages/NotificationsPage";
import ContactsPage from "./pages/ContactsPage";
import ContactPage from "./pages/ContactPage";
import SearchPage from "./pages/SearchPage";
import ShopPage from "./pages/ShopPage";
import ProductPage from "./pages/ProductPage";
import MyProfilePage from "./pages/MyProfilePage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import SavedPostsPage from "./pages/SavedPostsPage";
import Message from "./components/Message";

function App() {
  const [message, setMessage] = useState("");
  const [onlineUsersContext, setOnlineUsersContext] = useState([]);
  const [storyContext, setStoryContext] = useState(false);
  const [startAppFlag, setStartAppFlag] = useState(false);
  const [onlineUsersSocket, setOnlineUsersSocket] = useState(
    new WebSocket("ws://127.0.0.1:8000/ws/online_users")
  );
  const [sendFlag, setSendFlag] = useState(true);
  const nav = useNavigate();

  const handleTheme = () => {
    // Applying either dark or light theme depending on system default theme.
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.removeItem("theme");
  };

  const initApp = () => {
    handleTheme();
    setStartAppFlag(true);
    if (!localStorage.getItem("my_id")) nav("/login");

    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setMessage("order completed");
    }
    if (query.get("cancel")) {
      setMessage("payment unsuccessful!");
    }
  };

  useEffect(() => {
    setTimeout(initApp, 2000);
  }, []);

  useEffect(() => {
    if (sendFlag && onlineUsersSocket.readyState === 1) {
      onlineUsersSocket.send(
        JSON.stringify({
          users: {
            id: localStorage.getItem("my_id"),
            username: localStorage.getItem("my_username"),
            profile_picture: localStorage.getItem("my_profile_picture"),
          },
        })
      );

      onlineUsersSocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setOnlineUsersContext(data["users"]);
      };

      setSendFlag(false);
    }
  });

  if (startAppFlag)
    return (
      <main className="bg-white w-screen text-sm mx-auto max-w-4xl h-screen overflow-auto dark:text-white dark:bg-black">
        <OnlineUsersContext.Provider
          value={[onlineUsersContext, setOnlineUsersContext]}
        >
          <StoryContext.Provider value={[storyContext, setStoryContext]}>
            {message ? <Message /> : null}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/saved-posts" element={<SavedPostsPage />} />
              <Route path="/create-username" element={<CreateUserNamePage />} />
              <Route path="/create-password" element={<CreatePasswordPage />} />
              <Route path="/create-email" element={<CreateEmailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/addPost" element={<AddPostPage />} />
              <Route path="/addStory" element={<AddStoryPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/contact/:user_id" element={<ContactPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/shop/:shop_name" element={<ShopPage />} />
              <Route path="/product/:product_name" element={<ProductPage />} />
              <Route path="/my-profile" element={<MyProfilePage />} />
              <Route path="/profile/:profile_id" element={<ProfilePage />} />
              <Route path="/post/:post_id" element={<PostPage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
            </Routes>
          </StoryContext.Provider>
        </OnlineUsersContext.Provider>
      </main>
    );
  else
    return (
      <section className="fixed top-0 left-0 flex flex-col w-screen h-screen bg-white dark:bg-black z-20">
        <div className="m-auto rounded-3xl w-24 h-24 bg-gradient-to-r p-[8px] from-blue-500 via-pink-500 to-yellow-500 ">
          <div className="flex flex-col justify-between h-full bg-white dark:bg-black rounded-lg p-2">
            <div className="rounded-full m-auto w-[52px] h-[52px] bg-gradient-to-r p-[6px] from-blue-500 via-pink-500 to-yellow-500 ">
              <div className="flex flex-col justify-between h-full bg-white dark:bg-black rounded-full">
                <div className="relative left-11 bottom-3 rounded-full bg-gradient-to-r from-blue-500 to-yellow-500 p-1.5 w-0.5 h-0.5"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto text-lg text-black dark:text-white font-mono">
          from
        </div>
        <div className="mx-auto text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-500">
          Rami
        </div>
      </section>
    );
}

export default App;
