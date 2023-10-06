import React from "react";

const Message = ({ msg }) => {
  return (
    <div className="container mx-auto">
      <p>{msg}</p>
    </div>
  );
};

export default Message;
