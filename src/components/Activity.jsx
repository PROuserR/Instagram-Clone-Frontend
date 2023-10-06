import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Activity = ({
  influncerId,
  profileImage,
  username,
  action,
  dateAdded,
}) => {
  const [mentionAction, setMentionAction] = useState();
  const nav = useNavigate();

  useEffect(() => {
    if (action.includes("@")) {
      const startingIndex = action.search("@");
      const endingIndex = action.length;
      setMentionAction(action.substring(startingIndex, endingIndex));
    }
  }, []);

  return (
    <div onClick={() => nav(`/profile/${influncerId}`)}>
      <div className="flex space-x-2 items-center">
        <img
          className="w-10 h-10 aspect-square rounded-full"
          src={`http://127.0.0.1:8000/media/${profileImage}`}
        />
        <div>
          <b>{username}</b>{" "}
          {action.includes("@") ? (
            <>
              Mentioned you in a comment{" "}
              <span className="text-blue-500">{mentionAction}</span>
            </>
          ) : (
            action
          )}
          <span className="text-xs text-gray-400"> {dateAdded}</span>
        </div>
        {/* <button className='ml-auto bg-blue-500 py-1.5 px-4 rounded-lg'>Follow</button> */}
      </div>
    </div>
  );
};

export default Activity;
