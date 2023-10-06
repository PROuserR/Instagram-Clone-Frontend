import React, { useState } from "react";

const AuthAlert = () => {
  const [isShown, setIsShown] = useState(true);

  if (isShown)
    return (
      <div className="flex flex-col absolute top-1/3 bg-zinc-900 rounded-xl w-4/5">
        <div className="flex flex-col p-4">
          <div className="text-xl mb-2">Incorrect Password</div>
          <div className="text-gray-400 w-4/5 mx-auto">
            The password you entered is incorrect. Please try agian.
          </div>
        </div>
        <button
          onClick={() => setIsShown(false)}
          className="p-4 border-t border-gray-600 w-full"
        >
          Ok
        </button>
      </div>
    );
};

export default AuthAlert;
