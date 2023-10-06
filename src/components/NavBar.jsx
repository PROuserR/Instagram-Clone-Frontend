import { React, useState, useEffect } from "react";
import { ReactComponent as HomeIcon } from "../assets/home.svg";
import { ReactComponent as SearchIcon } from "../assets/search.svg";
import { ReactComponent as AddIcon } from "../assets/plus.svg";
import { ReactComponent as HeartIcon } from "../assets/heart.svg";
import { ReactComponent as AddFillIcon } from "../assets/plus-fill.svg";
import { ReactComponent as HeartFillIcon } from "../assets/heart-fill.svg";
import { ReactComponent as ProfileIcon } from "../assets/profile.svg";
import { ReactComponent as HomeFillIcon } from "../assets/home-fill.svg";
import { ReactComponent as ProfileFillIcon } from "../assets/profile-fill.svg";
import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  const [homeIcon, setHomeIcon] = useState(<HomeIcon className="w-6" />);
  const [addIcon, setAddIcon] = useState(
    <AddIcon className="w-6 rounded-md" />
  );
  const [heartIcon, setHeartIcon] = useState(<HeartIcon className="w-6" />);
  const [profileIcon, setProfileIcon] = useState(
    <ProfileIcon className="w-6" />
  );

  const adjust_icon = () => {
    switch (location.pathname) {
      case "/":
        setHomeIcon(<HomeFillIcon className="w-6" />);
        break;
      case "/addPost":
        setAddIcon(<AddFillIcon className="w-6 rounded-md" />);
        break;
      case "/notifications":
        setHeartIcon(<HeartFillIcon className="w-6" />);
        break;
      case "/my-profile":
        setProfileIcon(<ProfileFillIcon className="w-6" />);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    adjust_icon();
  }, []);

  return (
    <nav
      className="flex fixed bottom-0 w-screen mx-auto max-w-4xl bg-white dark:bg-black z-10 items-center p-1"
      onClick={adjust_icon}
    >
      <Link className="mx-auto" to="/">
        {homeIcon}
      </Link>
      <Link className="mx-auto" to="/search">
        <SearchIcon className="w-6" />
      </Link>
      <Link className="mx-auto" to="/addPost">
        {addIcon}
      </Link>
      <Link className="mx-auto" to="/notifications">
        {heartIcon}
      </Link>
      {localStorage.getItem("my_profile_picture").length ? (
        <Link to="/my-profile" className="mx-auto">
          <img
            className="w-8 h-8 rounded-full"
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
        </Link>
      ) : (
        <Link className="mx-auto" to="/my-profile">
          {profileIcon}
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
